import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../reducers';
import { User } from '../interfaces';
import Sidebar from './Sidebar';
import Chat from './Chat';
import Register from './Register';
import CreateChannel from './CreateChannel';

export default connect((state: State) => ({ me: state.chats.me }))(App);

function App(props: { me: User | undefined }) {
    return (
        <div className="app">
            {props.me === undefined ? (
                <Register />
            ) : (
                <>
                    <Sidebar />
                    <Chat />

                    <CreateChannel />
                </>
            )}
        </div>
    );
}
