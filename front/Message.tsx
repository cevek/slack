import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { State } from './reducers';
import { Message, User } from './interfaces';

export default connect((state: State, props: { msg: Message }) => ({
    user: state.chats.users.find(user => user.id === props.msg.fromUserId),
}))(MessageItem);

function MessageItem(props: { msg: Message; user: User }) {
    if (props.user === undefined) return null;
    return (
        <div className="message">
            <div
                className="message__userpick"
                style={{
                    backgroundImage: 'url(https://unicornify.pictures/avatar/aaaaaaa' + props.user.id + '?s=100)',
                }}
            />
            <div className="message__group">
                <div className="message__username">
                    {props.user.name}
                    <div className="message__time">
                        {new Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                        }).format(new Date(props.msg.date))}
                    </div>
                </div>
                <div className="message__message">{props.msg.message}</div>
            </div>
        </div>
    );
}
