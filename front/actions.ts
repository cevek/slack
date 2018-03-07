import ReduxThunk from 'redux-thunk';
import * as types from './constants';
import * as Redux from 'redux';

import io from 'socket.io-client';
import { Dispatch, Store } from 'react-redux';
import { Message, User, Channel } from './interfaces';
const client = io('http://localhost:3001/', { query: { userSid: localStorage.getItem('sid') } });

export function initSocket(store: Redux.Store<{}>) {
    client.on('connect', () => {
        getInfo()(store.dispatch);
        client.on('userAdded', (data: User) => {
            store.dispatch({ type: types.USER_ADDED, payload: data });
        });
        client.on('channelAdded', (data: Channel) => {
            store.dispatch({ type: types.CHANNEL_ADDED, payload: data });
        });
        client.on('message', (data: Message) => {
            store.dispatch({ type: types.MESSAGE_ADDED, payload: data });
        });
    });
}

type ResponseData = { status: 'ok' } | { status: 'error'; error: string };

export function register(name: string) {
    return (dispatch: Dispatch<{}>) => {
        client.emit(
            'register',
            { name },
            (data: ResponseData & { me: User; sid: string; users: User[]; channels: Channel[] }) => {
                if (data.status === 'ok') {
                    localStorage.setItem('sid', data.sid);
                    dispatch({ type: types.SET_INFO, payload: data });
                }
            }
        );
    };
}

export function sendMessage(channelId: string, message: string) {
    return (dispatch: Dispatch<{}>) => {
        client.emit('message', { message, channelId }, (data: ResponseData) => {
            if (data.status === 'ok') {
            }
        });
    };
}


export function createChannel(name: string) {
    return (dispatch: Dispatch<{}>) => {
        client.emit('createChannel', { name }, (data: ResponseData) => {
            if (data.status === 'ok') {
            }
        });
    };
}

export function getInfo() {
    return (dispatch: Dispatch<{}>) => {
        client.emit('getInfo', {}, (data: ResponseData & { users: User[]; channels: Channel[] }) => {
            if (data.status === 'ok') {
                dispatch({ type: types.SET_INFO, payload: data });
            }
        });
    };
}

export function getMessages(channelId: string) {
    return (dispatch: Dispatch<{}>) => {
        client.emit('getMessages', { channelId }, (data: ResponseData & { channelId: string; messages: Message[] }) => {
            if (data.status === 'ok') {
                dispatch({ type: types.SET_MESSAGES, payload: data });
            }
        });
    };
}

export function selectChannel(channelId: string) {
    return (dispatch: Dispatch<{}>) => {
        dispatch({ type: types.SELECT_CHANNEL, payload: channelId });
        client.emit('getChannelMessages', { channelId }, (data: ResponseData & { messages: Message[] }) => {
            if (data.status === 'ok') {
                dispatch({ type: types.SET_MESSAGES, payload: data.messages, channelId });
            }
        });
    };
}
