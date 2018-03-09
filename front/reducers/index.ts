import { combineReducers } from 'redux';
import { chats } from './chats';
import { ChatState } from '../interfaces';

const rootReducer = combineReducers({
    chats,
});

export interface State {
    chats: ChatState;
}
export default rootReducer;
