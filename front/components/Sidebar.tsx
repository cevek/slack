import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { setVisibilityCreateChannelForm } from '../actions';
import { State } from '../reducers';
import Channels from './Channels';
import { Channel, User } from '../interfaces';

export default connect(
    ({ chats: { channels, users, me } }: State) => ({ channels, users, me }),
    dispatch => ({
        showCreateChannelForm: () => dispatch(setVisibilityCreateChannelForm(true)),
    })
)(Sidebar);

function Sidebar(props: { channels: Channel[]; users: User[]; me: User | undefined; showCreateChannelForm(): void }) {
    return (
        <div className="sidebar">
            <div className="sidebar__channels">
                <div className="sidebar__title">
                    Channels
                    <div onClick={props.showCreateChannelForm} className="sidebar__plus">
                        +
                    </div>
                </div>
                <Channels channels={props.channels} />
            </div>
            <div className="sidebar__users">
                <div className="sidebar__title">Direct Messages</div>
                <Channels channels={props.users.filter(user => user.id !== props.me!.id)} />
            </div>
        </div>
    );
}
