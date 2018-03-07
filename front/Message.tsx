import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { State } from './reducers';
import { User, Message } from './interfaces';

export default connect((state: State, props: { msg: Message }) => ({
    user: state.chats.users.find(user => user.id === props.msg.fromUserId),
}))(MessageItem);

function MessageItem(props: { msg: Message; user: User }) {
    if (props.user === undefined) return null;
    return (
        <div className="chat">
            <div>{props.user.name}</div>
            <div>{props.msg.message}</div>
        </div>
    );
}
