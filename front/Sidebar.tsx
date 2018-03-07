import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { selectChannel } from './actions';
import { State } from './reducers';
import Channels from './Channels';
import { Channel, User } from './interfaces';
import CreateChannel from './CreateChannel';

const SidebarMapStateToProps = (state: any) => {
    return {
        channels: state.chats.channels,
        users: state.chats.users,
    };
};

export default connect(({ chats: { channels, users, me } }: State) => ({ channels, users, me }))(Sidebar);

function Sidebar(props: { channels: Channel[]; users: User[]; me: User }) {
    return (
        <div>
            <div>
                <div>Channels</div>
                <Channels channels={props.channels} />
                <CreateChannel />
            </div>
            <div>
                <div>Users</div>
                <Channels
                    channels={props.users
                        .filter(user => user.id !== props.me.id)
                        .map(user => ({ id: user.channelId, name: user.name }))}
                />
            </div>
        </div>
    );
}
