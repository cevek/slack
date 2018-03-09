import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { createChannel, setVisibilityCreateChannelForm } from '../actions';
import { State } from '../reducers';

export default connect(
    (state: State) => ({ isVisible: state.chats.isCreateChannelFormVisible }),
    dispatch => ({
        createChannel: (name: string) => dispatch(createChannel(name)),
        hideForm: () => dispatch(setVisibilityCreateChannelForm(false)),
    })
)(CreateChannel);

function CreateChannel(props: { isVisible: boolean; hideForm(): void; createChannel(name: string): void }) {
    let input: HTMLInputElement | null;
    if (!props.isVisible) return null;
    return (
        <div className="create-channel-form">
            <h2>Create a Channel</h2>
            <form
                onSubmit={e => {
                    props.createChannel(input!.value);
                    e.preventDefault();
                    input!.value = '';
                    props.hideForm();
                }}>
                <input
                    className="create-channel-form__input"
                    placeholder="Channel name"
                    ref={el => (input = el)}
                    required
                    autoFocus
                    maxLength={20}
                    type="text"
                />
                <div>
                    <button type="button" onClick={props.hideForm} className="create-channel-form__btn">
                        Cancel
                    </button>
                    <button className="create-channel-form__btn">Create</button>
                </div>
            </form>
        </div>
    );
}
