import * as Types from '../constants';
import { Channel, User, Message } from '../interfaces';

const initialState: ChatState = {
    channels: [],
    messagesByChannels: {},
    users: [],
    currentChannelId: undefined,
    me: undefined,
};

export interface ChatState {
    channels: Channel[];
    users: User[];
    messagesByChannels: { [key: string]: Message[] };
    currentChannelId: string | undefined;
    me: User | undefined;
}

export function chats(state = initialState, action: any) {
    switch (action.type) {
        case Types.SET_MESSAGES:
            return {
                ...state,
                messagesByChannels: {
                    ...state.messagesByChannels,
                    [action.channelId]: action.payload,
                },
            };

        case Types.SET_INFO:
            return { ...state, me: action.payload.me, channels: action.payload.channels, users: action.payload.users };

        case Types.USER_ADDED:
            return { ...state, users: [...state.users, action.payload] };

        case Types.CHANNEL_ADDED:
            return { ...state, channels: [...state.channels, action.payload] };

        case Types.MESSAGE_ADDED:
            return {
                ...state,
                messagesByChannels: {
                    ...state.messagesByChannels,
                    [action.payload.channelId]: [...(state.messagesByChannels[action.payload.channelId] || []), action.payload],
                },
            };
        case Types.SELECT_CHANNEL:
            return { ...state, currentChannelId: action.payload };

        default:
            return state;
    }
}

