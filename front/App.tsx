import * as React from 'react';
import Sidebar from './Sidebar';
import Chat from './Chat';
import { connect } from 'react-redux';
import { State } from './reducers';
import { RegisterContainer } from './Register';
import { User } from './interfaces';
import CreateChannel from './CreateChannel';

export default connect((state: State) => ({ me: state.chats.me }))(App);

function App(props: { me: User | undefined }) {
    return (
        <div className="app">
            {props.me === undefined ? (
                <RegisterContainer />
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
