import { combineReducers } from 'redux';
import { chats, ChatState } from './chats';

const rootReducer = combineReducers({
    chats,
});

export interface State {
    chats: ChatState;
}
export default rootReducer;
