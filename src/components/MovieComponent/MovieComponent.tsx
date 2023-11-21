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
}

const MovieComponent: React.FC = () => {
    const params = useParams();
    const [isStarted, setIsStarted] = useState<boolean>(false);
    const [currentSubText, setCurrentSubText] = useState<string>('');
    const [timerId, setTimerId] = useState<number>(0);

    useEffect(() => {
        const movie = getMovie();

        if (movie && movie.isStarted) {
            startTimer(movie);
        }
    }, []);

    const startTimer = (movie?: IMovie): void => {
        var index = -1;

        if (movie) {
            const startTimestamp = movie.startTimestamp;
            index = movie.subtitles.findIndex(x => (startTimestamp + x.startSeconds * 1000) >= new Date().getTime());
        } else {
            movie = getMovie();

            if (!movie) {
                return; 
            }

            movie.startTimestamp = new Date().getTime();
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
        localStorage.setItem(getMovieKey(), JSON.stringify(movie));
        setIsStarted(false);
        window.clearTimeout(timerId);
        setCurrentSubText('');
    };

    const getMovie = (): IMovie | undefined => {
        const movie = JSON.parse(localStorage.getItem(getMovieKey()) ?? '{}');

        return movie.subtitles
            ? {
                subtitles: movie.subtitles,
                isStarted: movie.isStarted ?? false,
                startTimestamp: movie.startTimestamp ?? 0,
            } : undefined;
    }

    const getMovieKey = (): string => {
        return `movie:${params.id}`;
    }

    const showSubs = (movie:IMovie, index: number): void => {
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

            setTimerId(window.setTimeout(() => {
                index++;
                showSubs(movie, index);
            }, interval * 1000));
        } else {
            stopTimer(movie);
        }
    }

    return <div className="MovieComponent">
        <div>
        {
            isStarted
                ? <button onClick={() => stopTimer()}>Stop</button>
                : <button onClick={() => startTimer()}>Start</button>
        }
        </div>
        <div>{currentSubText}</div>
    </div>
};

export default MovieComponent;
