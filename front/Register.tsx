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
            <form
                onSubmit={e => {
                    props.register(input!.value);
                    e.preventDefault();
                }}>
                <input ref={el => (input = el)} type="text" />
                <button>Enter</button>
            </form>
        </div>
    );
}
