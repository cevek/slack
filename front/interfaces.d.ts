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
