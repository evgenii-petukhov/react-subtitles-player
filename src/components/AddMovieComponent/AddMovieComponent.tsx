import React, { useState } from 'react';
import Parser from 'srt-parser-2';

interface IState {
    name: string;
    content: string;
}

const AddMovieComponent: React.FC = () => {
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

    return <form onSubmit={onFormSubmitted}>
        <div>
            Name: <input type='text'
                value={data?.name}
                onChange={onNameChanged} />
        </div>
        <div>
            <textarea value={data?.content}
                onChange={onContentChanged} />
        </div>
        <div>
            <input type='submit' value='Submit' disabled={!data.name || !data.content} />
        </div>
    </form>;
};

export default AddMovieComponent;
