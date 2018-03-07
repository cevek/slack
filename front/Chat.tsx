import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { State } from './reducers';
import MessageView from './Message';
import { Channel, Message } from './interfaces';
import SendMessage from './SendMessage';

export default connect((state: State) => ({
    channelId: state.chats.currentChannelId,
    messages: state.chats.messagesByChannels[state.chats.currentChannelId!],
}))(Chat);

function Chat(props: { channelId: string | undefined; messages: Message[] }) {
    if (props.channelId === undefined) return null;
    return (
        <div className="chat">
            {props.messages && props.messages.map(msg => <MessageView msg={msg} />)}
            <SendMessage />
        </div>
    );
}
