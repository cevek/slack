import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { register } from './actions';

export const RegisterContainer = connect(undefined, dispatch => ({
    register: (name: string) => dispatch(register(name)),
}))(Register);

export function Register(props: { register(name: string): void }) {
    let input: HTMLInputElement | null;
    return (
        <div className="register">
            <h2>Enter to Chat</h2>
            <form
                onSubmit={e => {
                    props.register(input!.value);
                    e.preventDefault();
                }}>
                <input
                    placeholder="Your nickname"
                    required
                    maxLength={20}
                    autoFocus
                    className="register__input"
                    ref={el => (input = el)}
                    type="text"
                />
                <div>
                    <button className="register__btn">Enter</button>
                </div>
            </form>
        </div>
    );
}
