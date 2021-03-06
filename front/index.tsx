import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk';
import App from './components/App';
import { initSocket } from './actions';

const store = createStore(rootReducer, applyMiddleware(thunk));
// window.store = store;
initSocket(store);
render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
