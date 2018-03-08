import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { State } from './reducers';
import MessageView from './Message';
import { Channel, Message, User } from './interfaces';
import SendMessage from './SendMessage';

export default connect((state: State) => ({
    channelId: state.chats.currentChannelId,
    user: state.chats.users.find(user => user.id === state.chats.currentUserId),
    channel: state.chats.channels.find(ch => ch.id === state.chats.currentChannelId),
    messages: state.chats.messagesByChannels[state.chats.currentChannelId!],
}))(Chat);

function Chat(props: { user: User; channelId: string | undefined; channel: Channel | undefined; messages: Message[] }) {
    if (props.channelId === undefined) return null;
    const name = props.channel ? props.channel.name : props.user.name;
    return (
        <div className="chat">
            <div className="chat__header">
                <div className="chat__header-title">{name}</div>
            </div>
            <div ref={el => el && (el.scrollTop = 9999999)} className="chat__messages">
                {props.messages && props.messages.map((msg, i) => <MessageView key={i} msg={msg} />)}
            </div>
            <SendMessage isChannel={!props.user} name={name} />
        </div>
    );
}
