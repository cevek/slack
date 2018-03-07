import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { register, createChannel } from './actions';

export default connect(undefined, dispatch => ({
    createChannel: (name: string) => dispatch(createChannel(name)),
}))(CreateChannel);

export function CreateChannel(props: { createChannel(name: string): void }) {
    let input: HTMLInputElement | null;
    return (
        <div className="register">
            <form
                onSubmit={e => {
                    props.createChannel(input!.value);
                    e.preventDefault();
                    input!.value = '';
                }}>
                <input ref={el => (input = el)} type="text" />
                <button>Create</button>
            </form>
        </div>
    );
}
