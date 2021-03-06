import Server from 'socket.io';
import Koa from 'koa';
import KoaStatic from 'koa-static';
import http from 'http';
const app = new Koa();
app.use(KoaStatic('../front/dist/'));
const server = http.createServer(app.callback());
server.listen(3000);
console.log('App is listening on http://localhost:3000/');

process.on('uncaughtException', function(err) {
    console.error('Caught exception: ', err);
});

class Message {
    channelId: string;
    fromUserId: string;
    date: Date;
    message: string;
}
class User {
    id: string;
    session: string;
    name: string;
    socket: any;
    inRooms: string[];
}

function genId() {
    return Math.random()
        .toString(33)
        .substr(2, 10);
}

interface Channel {
    id: string;
    name: string;
    messages: Message[];
    isPrivate: boolean;
}

const users: User[] = [];
const channels: Channel[] = [];
const channelsMap = new Map<string, Channel>();
const userUserChannels = new Map<string, Channel>();

const io = Server(server);

io.on('connection', socket => {
    let currentUser: User | undefined = undefined;
    let sid = socket.handshake.query.userSid;
    if (sid === undefined) {
        sid = genId();
    } else {
        currentUser = users.find(user => user.session === sid);
        if (currentUser !== undefined) {
            currentUser.socket = socket;
            currentUser.inRooms.map(id => currentUser!.socket.join(id));
        } else {
            sid = genId();
        }
    }

    function checkAuth(done: (ack: any) => void) {
        if (currentUser === undefined) {
            done({ status: 'error', error: 'You need to register' });
            return false;
        }
        return true;
    }

    function createChannel(channel: Channel) {
        channels.push(channel);
        channelsMap.set(channel.id, channel);
    }

    function getChannelWithUser(user: User) {
        const hash = user.id > currentUser!.id ? currentUser!.id + '_' + user.id : user.id + '_' + currentUser!.id;
        let channel = userUserChannels.get(hash);
        if (channel === undefined) {
            channel = {
                id: genId(),
                isPrivate: true,
                messages: [],
                name: '',
            };
            createChannel(channel);
            userUserChannels.set(hash, channel);
            joinUserToChannel(currentUser!, channel);
            joinUserToChannel(user, channel);
        }

        return channel;
    }

    function getInfo() {
        return {
            status: 'ok',
            me: { id: currentUser!.id, name: currentUser!.name },
            users: users.map(user => ({ id: user.id, name: user.name, channelId: getChannelWithUser(user).id })),
            channels: channels
                .filter(channel => !channel.isPrivate)
                .map(channel => ({ id: channel.id, name: channel.name })),
        };
    }

    socket.on('register', (data: { name: string }, done: (ack: any) => void) => {
        if (typeof data.name !== 'string' || data.name.length === 0 || data.name.length > 20)
            return done({ status: 'error', error: 'Name is not correct' });
        const existsUser = users.find(user => user.name === data.name);
        if (existsUser !== undefined) return done({ status: 'error', error: 'Name is already registered' });
        currentUser = { id: genId(), name: data.name, socket, session: sid, inRooms: [] };
        users.push(currentUser);
        users.forEach(user => {
            if (user === currentUser) return;
            io.to(user.socket.id).emit('userAdded', {
                id: currentUser!.id,
                name: currentUser!.name,
                channelId: getChannelWithUser(user).id,
            });
        });
        channels.filter(channel => !channel.isPrivate).forEach(channel => {
            joinUserToChannel(currentUser!, channel);
        });
        done({ ...getInfo(), sid: sid });
    });

    socket.on('getInfo', (data: {}, done: (ack: any) => void) => {
        if (!checkAuth(done)) return;
        return done(getInfo());
    });

    socket.on('getChannelMessages', (data: { channelId: string }, done: (ack: any) => void) => {
        if (!checkAuth(done)) return;
        const channel = channelsMap.get(data.channelId);
        if (channel === undefined) {
            return done({
                status: 'ok',
                messages: [],
            });
        }
        return done({
            status: 'ok',
            messages: channel.messages,
        });
    });

    socket.on('createChannel', (data: { name: string }, done: (ack: any) => void) => {
        if (!checkAuth(done)) return;
        if (typeof data.name !== 'string' || data.name.length === 0 || data.name.length > 20)
            return done({ status: 'error', error: 'Name is not correct' });
        let channel = channels.find(channel => channel.name === data.name);
        if (channel !== undefined) return done({ status: 'error', error: 'Name is already registered' });
        const channelId = genId();
        channel = { id: channelId, name: data.name, isPrivate: false, messages: [] };
        createChannel(channel);
        users.forEach(user => {
            joinUserToChannel(user, channel!);
        });
        io.emit('channelAdded', channel);
        return done({ status: 'ok' });
    });

    function createMessage(text: string, channel: Channel, channelUserId?: string) {
        const message: Message = {
            channelId: channel.id,
            date: new Date(),
            fromUserId: currentUser!.id,
            message: text,
        };
        channel.messages.push(message);
        return message;
    }

    function joinUserToChannel(user: User, channel: Channel) {
        user.socket.join(channel.id);
        user.inRooms.push(channel.id);
    }

    socket.on('message', (data: { channelId: string; message: string }, done: (ack: any) => void) => {
        if (!checkAuth(done)) return;
        const channel = channelsMap.get(data.channelId);
        if (channel === undefined) return done({ status: 'error', error: 'Channel is not found' });
        const msg = createMessage(data.message, channel);
        io.to(channel.id).emit('message', msg);
        return done({ status: 'ok' });
    });
});
