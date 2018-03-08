import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { State } from './reducers';
import { Message } from './interfaces';
import { sendMessage } from './actions';

export default connect(
    (state: State) => ({
        channelId: state.chats.currentChannelId,
    }),
    dispatch => ({
        sendMessage: (channelId: string, text: string) => dispatch(sendMessage(channelId, text)),
    })
)(SendMessageForm);

function SendMessageForm(props: {
    name: string;
    isChannel: boolean;
    channelId: string;
    sendMessage(channelId: string, text: string): void;
}) {
    let input: HTMLInputElement | null;

    return (
        <div className="send-message-form">
            <form
                onSubmit={e => {
                    props.sendMessage(props.channelId, input!.value);
                    e.preventDefault();
                    input!.value = '';
                }}>
                <input
                    className="send-message-form__input"
                    ref={el => (input = el)}
                    type="text"
                    placeholder={'Message ' + (props.isChannel ? '#' : '@') + props.name}
                />
            </form>
        </div>
    );
}
