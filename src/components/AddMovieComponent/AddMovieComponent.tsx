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
            <div className="col-md-4 mb-3">
                <label className="form-label">Movie name</label>
                <input type="text" className="form-control" value={userInput?.name}
                    onChange={onNameChanged}/>
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Paste subtitles as text</label>
                <textarea className="form-control" value={userInput?.content}
                    onChange={onContentChanged} rows={5}></textarea>
            </div>
        </form>
        <FooterComponent isToolbarShown={true} isExitButtonShown={true}>
            <button className='btn btn-dark'
                disabled={!userInput.name || !userInput.content}
                onClick={onSubmitClicked}>Submit</button>
        </FooterComponent>
    </div>;
};

export default AddMovieComponent;
