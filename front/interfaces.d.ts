export interface Message {
    channelId: string;
    channelUserId: string;
    fromUserId: string;
    date: Date;
    message: string;
    read: boolean;
}

export interface Channel {
    id: string;
    name: string;
}

export interface User {
    id: string;
    name: string;
    channelId: string;
}

export interface ChatState {
    channels: Channel[];
    users: User[];
    messagesByChannels: { [key: string]: Message[] };
    unreadMessagesByChannels: { [key: string]: boolean };
    currentChannelId: string | undefined;
    currentUserId: string | undefined;
    me: User | undefined;
    isCreateChannelFormVisible: boolean;
}
