import React, { useState } from 'react';
import Parser from 'srt-parser-2';
import FooterComponent from '../FooterComponent/FooterComponent';
import './AddMovieComponent.scss';
import { getSubtitlesKey } from '../../helpers/localStorageItemNameHelper';

interface IState {
    name: string;
    content: string;
}

const AddMovieComponent: React.FC = () => {
    let formRef: HTMLFormElement | null = null;

    const [userInput, setUserInput] = useState<IState>({
        name: '',
        content: ''
    });

    const onNameChanged = (e: React.ChangeEvent<HTMLInputElement>) : void => {
        setUserInput({
            ...userInput,
            name: e.target.value
        });
    };

    const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) : void => {
        setUserInput({
            ...userInput,
            content: e.target.value
        });
    };

    const onFormSubmitted = () : void => {
        const parser = new Parser();
        const subtitles = parser.fromSrt(userInput.content);
        if (subtitles) {
            const uuid = crypto.randomUUID();
            localStorage.setItem(`movie:info:${uuid}`, JSON.stringify({
                name: userInput.name
            }));
            localStorage.setItem(getSubtitlesKey(uuid), JSON.stringify(subtitles));
        }
    };

    const onSubmitClicked = (): void => {
        formRef?.requestSubmit();
    };

    const getFormRefWraper = (node: HTMLFormElement) => {
        formRef = formRef ?? node;
    };

    return <div className='AddMovieComponent'>
        <form ref={getFormRefWraper} onSubmit={onFormSubmitted}>
            <div className='form-row'>
                Name: <input type='text'
                    value={userInput?.name}
                    onChange={onNameChanged} />
            </div>
            <div className='form-row'>
                Subtitles: <textarea value={userInput?.content}
                    onChange={onContentChanged} rows={5} />
            </div>
        </form>
        <FooterComponent isToolbarShown={true}>
            <button disabled={!userInput.name || !userInput.content} onClick={onSubmitClicked}>Submit</button>
        </FooterComponent>
    </div>;
};

export default AddMovieComponent;
