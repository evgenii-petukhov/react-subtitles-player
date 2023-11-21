import React, { useState } from 'react';

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

    const onFormSubmitted = (e: React.FormEvent<HTMLFormElement>) : void => {
        localStorage.setItem(`movie:${data.name}`, data.content);
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
