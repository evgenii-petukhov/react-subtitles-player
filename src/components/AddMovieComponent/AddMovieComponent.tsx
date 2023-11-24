import React, { useEffect, useState } from 'react';
import Parser from 'srt-parser-2';
import FooterComponent from '../FooterComponent/FooterComponent';
import './AddMovieComponent.scss';
import { getSubtitlesKey, isMovieInfoItem } from '../../helpers/localStorageItemNameHelper';
import { useNavigate } from 'react-router';

interface IState {
    name: string;
    content: string;
}

const AddMovieComponent: React.FC = () => {
    const navigate = useNavigate();
    const [isMovieListEmpty, setIsMovieListEmpty] = useState(false);

    useEffect(() => {
        setIsMovieListEmpty(checkIfMovieListIsEmpty());
    }, []);

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

    const onSubmitButtonClicked = () : void => {
        const parser = new Parser();
        const subtitles = parser.fromSrt(userInput.content);
        if (subtitles) {
            const uuid = crypto.randomUUID();
            localStorage.setItem(`movie:info:${uuid}`, JSON.stringify({
                name: userInput.name
            }));
            localStorage.setItem(getSubtitlesKey(uuid), JSON.stringify(subtitles));
            navigate(`/movie/${uuid}`);
        }
    };

    const checkIfMovieListIsEmpty = (): boolean => {
        for (var key in localStorage) {
            if (isMovieInfoItem(key)) {
                return false;
            }
        }

        return true;
    };

    return <div className='AddMovieComponent'>
        <div className='form-container'>
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
        </div>
        <FooterComponent isToolbarShown={true} isExitButtonShown={!isMovieListEmpty}>
            <button className='btn btn-dark'
                disabled={!userInput.name || !userInput.content}
                onClick={onSubmitButtonClicked}>Submit</button>
        </FooterComponent>
    </div>;
};

export default AddMovieComponent;
