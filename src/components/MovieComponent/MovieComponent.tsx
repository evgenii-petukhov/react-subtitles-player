import React, { useEffect, useState } from 'react';
import './MovieComponent.css';
import { useParams } from 'react-router-dom';

interface ISubtitle {
    id: string;
    startTime: string;
    startSeconds: number;
    endTime: string;
    endSeconds: number;
    text: string;
}

interface IMovie {
    subtitles: ISubtitle[];
    isStarted: boolean;
    startTimestamp: number;
    rewindMs: number;
}

const MovieComponent: React.FC = () => {
    const params = useParams();
    const [isStarted, setIsStarted] = useState<boolean>(false);
    const [currentSubText, setCurrentSubText] = useState<string>('');
    const [subtitleChangeTimerId, setSubtitleChangeTimerId] = useState<number>(0);
    const [hideToolbarTimerId, setHideToolbarTimerId] = useState<number>(0);
    const [isToolbarShown, setIsToolbarShown] = useState<boolean>(true);

    useEffect(() => {
        const movie = getMovie();

        if (movie && movie.isStarted) {
            startTimer(movie);
        }

        hideToolbar();
    }, []);

    const startTimer = (movie?: IMovie): void => {
        var index = -1;

        if (movie) {
            index = getIndex(movie);
        } else {
            movie = getMovie();

            if (!movie) {
                return;
            }

            movie.startTimestamp = new Date().getTime();
            movie.rewindMs = 0;
        }

        movie.isStarted = true;
        localStorage.setItem(getMovieKey(), JSON.stringify(movie));
        setIsStarted(true);
        showSubs(movie, index);
    };

    const stopTimer = (movie?: IMovie): void => {
        movie = movie ?? getMovie();
        if (!movie) {
            return;
        }
        movie.isStarted = false;
        movie.rewindMs = 0;
        localStorage.setItem(getMovieKey(), JSON.stringify(movie));
        setIsStarted(false);
        window.clearTimeout(subtitleChangeTimerId);
        setCurrentSubText('');
    };

    const getMovie = (): IMovie | undefined => {
        const movie = JSON.parse(localStorage.getItem(getMovieKey()) ?? '{}');

        return movie.subtitles
            ? {
                subtitles: movie.subtitles,
                isStarted: movie.isStarted ?? false,
                startTimestamp: movie.startTimestamp ?? 0,
                rewindMs: movie.rewindMs ?? 0
            } : undefined;
    }

    const getMovieKey = (): string => {
        return `movie:${params.id}`;
    }

    const showSubs = (movie: IMovie, index: number): void => {
        if (!movie.subtitles || !movie.isStarted || !movie.startTimestamp) {
            return;
        }

        if (index > -1) {
            setCurrentSubText(movie.subtitles[index].text);
        }

        if (index < movie.subtitles.length - 1) {
            const interval = index === -1
                ? movie.subtitles[0].startSeconds
                : (movie.subtitles[index + 1].startSeconds - movie.subtitles[index].startSeconds);

            setSubtitleChangeTimerId(window.setTimeout(() => {
                index++;
                showSubs(movie, index);
            }, interval * 1000));
        } else {
            stopTimer(movie);
        }
    }

    const rewind = (seconds: number): void => {
        window.clearTimeout(subtitleChangeTimerId);

        const movie = getMovie();

        if (!movie) {
            return;
        }

        movie.rewindMs = movie.rewindMs + seconds * 1000;

        localStorage.setItem(getMovieKey(), JSON.stringify(movie));

        showSubs(movie, getIndex(movie));
    };

    const getIndex = (movie: IMovie): number => {
        const startTimestamp = movie.startTimestamp + movie.rewindMs;
        return movie.subtitles.findIndex(x => (startTimestamp + x.startSeconds * 1000) >= new Date().getTime());
    };

    const hideToolbar = (): void => {
        setHideToolbarTimerId(window.setTimeout(() => {
            setIsToolbarShown(false);
        }, 10000));
    };

    const showToolbar = (): void => {
        window.clearTimeout(hideToolbarTimerId);
        setIsToolbarShown(true);
        hideToolbar();
    };

    return <div className="MovieComponent" onClick={showToolbar}>
        <div className={`buttons ${!isToolbarShown && 'hidden'}`}>
        {
                isStarted && <>
                    <button onClick={() => rewind(30)}>-30s</button>
                    <button onClick={() => rewind(5)}>-5s</button>
                </>  
            }
            {
                isStarted
                    ? <button onClick={() => stopTimer()}>Stop</button>
                    : <button onClick={() => startTimer()}>Start</button>
            }
            {
                isStarted && <>
                    <button onClick={() => rewind(-5)}>+5s</button>
                    <button onClick={() => rewind(-30)}>+30s</button>
                </>  
            }
        </div>
        <div className='text-container'>
            <div className='text'>{currentSubText}</div>
        </div>
    </div>
};

export default MovieComponent;
