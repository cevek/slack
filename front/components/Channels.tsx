import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { selectChannel } from '../actions';
import { State } from '../reducers';
import { Channel, User } from '../interfaces';
import { isUser } from '../utils';

export default connect(
    (state: State) => ({
        selectedChannelId: state.chats.currentChannelId,
        unreadMessagesByChannels: state.chats.unreadMessagesByChannels,
    }),
    dispatch => ({
        selectChannel: (channelId: string | undefined, userId: string | undefined) =>
            dispatch(selectChannel(channelId, userId)),
    })
)(Channels);

function Channels(props: {
    selectedChannelId: string | undefined;
    channels: (Channel | User)[];
    unreadMessagesByChannels: { [key: string]: boolean };
    selectChannel: (channelId: string | undefined, userId: string | undefined) => void;
}) {
    return (
        <div>
            <div>
                {props.channels!.map(ch => {
                    const channelId = isUser(ch) ? ch.channelId : ch.id;
                    const userId = isUser(ch) ? ch.id : undefined;
                    const isActive = channelId === props.selectedChannelId;
                    const hasUnread = props.unreadMessagesByChannels[channelId];
                    return (
                        <div
                            key={ch.id}
                            onClick={() => props.selectChannel!(channelId, userId)}
                            className={
                                'sidebar__link' +
                                (isActive ? ' sidebar__link--active' : '') +
                                (hasUnread ? ' sidebar__link--hasunread' : '')
                            }>
                            {ch.name}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
