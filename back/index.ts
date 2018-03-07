import Server from 'socket.io';
import * as HTTP from 'http';
const server = HTTP.createServer();

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
        .substr(2, 5);
}

interface Channel {
    id: string;
    name: string;
    messages: Message[];
    isPrivate: boolean;
}

const users: User[] = []; //new Map<string, User>();
const channels: Channel[] = []; //new Map<string, Channel>();

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
            done({ status: 'error', error: 'you need to register' });
            return false;
        }
        return true;
    }

    function getChannelWithUser(user: User) {
        const channelId = user.id > currentUser!.id ? currentUser!.id + '_' + user.id : user.id + '_' + currentUser!.id;
        let channel = channels.find(ch => ch.id === channelId);
        if (channel === undefined) {
            channel = {
                id: channelId,
                isPrivate: true,
                messages: [],
                name: '',
            };
            channels.push(channel);
            userJoin(currentUser!, channel);
            userJoin(user, channel);
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

    function findChannel(channelId: string) {
        let channel = channels.find(channel => channel.id === channelId);
        if (channel === undefined) {
            const m = channelId.match(/^(.*?)_(.*?)$/);
            if (m) {
                const user1 = users.find(user => user.id === m[1]);
                const user2 = users.find(user => user.id === m[2]);
                if (user1 === undefined || user2 === undefined) {
                    return;
                }
                return [];
            }
        }
    }

    socket.on('register', (data: { name: string }, done: (ack: any) => void) => {
        const existsUser = users.find(user => user.name === data.name);
        if (existsUser !== undefined) return done({ status: 'error', error: 'name is already registered' });
        currentUser = { id: genId(), name: data.name, socket, session: sid, inRooms: [] };
        users.push(currentUser);
        users.forEach(user => {
            if (user === currentUser) return;
            io
                .to(user.socket.id)
                .emit('userAdded', {
                    id: currentUser!.id,
                    name: currentUser!.name,
                    channelId: getChannelWithUser(user).id,
                });
        });
        done({ ...getInfo(), sid: sid });
    });

    socket.on('getInfo', (data: {}, done: (ack: any) => void) => {
        if (!checkAuth(done)) return;
        return done(getInfo());
    });

    socket.on('getChannelMessages', (data: { channelId: string }, done: (ack: any) => void) => {
        if (!checkAuth(done)) return;
        let channel = channels.find(channel => channel.id === data.channelId);
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
        let channel = channels.find(channel => channel.name === data.name);
        if (channel !== undefined) return done({ status: 'error', error: 'name is already registered' });
        const channelId = genId();
        channel = { id: channelId, name: data.name, isPrivate: false, messages: [] };
        channels.push(channel);
        users.forEach(user => {
            user.socket.join(channelId);
            user.inRooms.push(channelId);
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

    function userJoin(user: User, channel: Channel) {
        user.socket.join(channel.id);
        user.inRooms.push(channel.id);
    }

    socket.on('message', (data: { channelId: string; message: string }, done: (ack: any) => void) => {
        if (!checkAuth(done)) return;
        let channel = channels.find(channel => channel.id === data.channelId);
        if (channel === undefined) return done({ status: 'error', error: 'channel is not found' });
        const msg = createMessage(data.message, channel);
        io.to(channel.id).emit('message', msg);
        return done({ status: 'ok' });
    });
});

server.listen(3001);
