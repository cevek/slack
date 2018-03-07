import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { selectChannel } from './actions';
import { State } from './reducers';
import { Channel } from './interfaces';

export default connect(
    (state: State) => ({
        selectedChannelId: state.chats.currentChannelId,
    }),
    dispatch => ({
        selectChannel: (id: string) => dispatch(selectChannel(id)),
    })
)(Channels);

function Channels(props: {
    selectedChannelId: string | undefined;
    channels: Channel[];
    selectChannel: (id: string) => void;
}) {
    return (
        <div>
            <div>
                {props.channels!.map(ch => (
                    <div
                        onClick={() => props.selectChannel!(ch.id)}
                        className={'link ' + (ch.id === props.selectedChannelId ? 'link--active' : '')}>
                        {ch.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
