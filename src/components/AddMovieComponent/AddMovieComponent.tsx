import React, { useEffect, useRef, useState } from 'react';
import Parser from 'srt-parser-2';
import BackButtonComponent from '../BackButtonComponent/BackButtonComponent';
import './AddMovieComponent.css';

interface IState {
    name: string;
    content: string;
}

const AddMovieComponent: React.FC = () => {
    let formRef: HTMLFormElement | null = null;

    const [data, setData] = useState<IState>({
        name: '',
        content: ''
    });

    const onNameChanged = (e: React.ChangeEvent<HTMLInputElement>) : void => {
        setData({
            ... data,
            name: e.target.value
        });
    };

    const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) : void => {
        setData({
            ... data,
            content: e.target.value
        });
    };

    const onFormSubmitted = () : void => {
        const parser = new Parser();
        const subtitles = parser.fromSrt(data.content);
        if (subtitles) {
            localStorage.setItem(`movie:${data.name}`, JSON.stringify({
                subtitles: subtitles
            }));
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
                    value={data?.name}
                    onChange={onNameChanged} />
            </div>
            <div className='form-row'>
                Subtitles: <textarea value={data?.content}
                    onChange={onContentChanged} rows={5} />
            </div>
        </form>
        <BackButtonComponent isToolbarShown={true}>
            <button disabled={!data.name || !data.content} onClick={onSubmitClicked}>Submit</button>
        </BackButtonComponent>
    </div>;
};

export default AddMovieComponent;
