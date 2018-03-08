import { Channel, User } from './interfaces';

export function isUser(user: Channel | User): user is User {
    return !!(user as User).channelId;
}
