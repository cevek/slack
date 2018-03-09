import * as Types from '../constants';
import { ChatState } from '../interfaces';

const initialState: ChatState = {
    channels: [],
    messagesByChannels: {},
    unreadMessagesByChannels: {},
    users: [],
    currentChannelId: undefined,
    currentUserId: undefined,
    isCreateChannelFormVisible: false,
    me: undefined,
};

export function chats(state = initialState, action: any) {
    switch (action.type) {
        case Types.SET_MESSAGES:
            return {
                ...state,
                messagesByChannels: {
                    ...state.messagesByChannels,
                    [action.channelId]: action.payload,
                },
                unreadMessagesByChannels: {
                    ...state.unreadMessagesByChannels,
                    [action.channelId]: false,
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
                    [action.payload.channelId]: [
                        ...(state.messagesByChannels[action.payload.channelId] || []),
                        action.payload,
                    ],
                },
                unreadMessagesByChannels: {
                    ...state.unreadMessagesByChannels,
                    [action.payload.channelId]: action.payload.fromUserId !== state.me!.id,
                },
            };
        case Types.SELECT_CHANNEL:
            return { ...state, currentChannelId: action.payload.channelId, currentUserId: action.payload.userId };

        case Types.IS_CHANNEL_FORM_VISIBLE:
            return { ...state, isCreateChannelFormVisible: action.payload };

        default:
            return state;
    }
}
