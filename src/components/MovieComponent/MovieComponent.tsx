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
    lastDisplayedIndex: number;
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
        if (movie) {
            showSubs({
                isStarted: true,
                lastDisplayedIndex: movie.lastDisplayedIndex,
                startTimestamp: movie.startTimestamp,
                subtitles: movie.subtitles
            });
        } else {
            movie = movie ?? getMovie();

            if (movie) {
                showSubs({
                    isStarted: true,
                    lastDisplayedIndex: -1,
                    startTimestamp: new Date().getTime(),
                    subtitles: movie.subtitles
                });
            }
        }

        setIsStarted(true);
    };

    const stopTimer = (): void => {
        localStorage.setItem('isStarted', '0');
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
                lastDisplayedIndex: movie.lastDisplayedIndex ?? -1
            } : undefined;
    }

    const getMovieKey = (): string => {
        return `movie:${params.id}`;
    }

    const showSubs = (movie:IMovie): void => {
        if (!movie.subtitles || !movie.isStarted || !movie.startTimestamp) {
            return;
        }

        if (movie.startTimestamp) {
            movie.lastDisplayedIndex = movie.subtitles.findIndex(x => (movie.startTimestamp + x.startSeconds * 1000) >= new Date().getTime());
            if (timerId) {
                window.clearTimeout(timerId);
            }
        }

        if (movie.lastDisplayedIndex > -1) {
            setCurrentSubText(movie.subtitles[movie.lastDisplayedIndex].text);
        }

        localStorage.setItem(getMovieKey(), JSON.stringify(movie));

        if (movie.lastDisplayedIndex < movie.subtitles.length - 1) {
            const interval = movie.lastDisplayedIndex === -1
                ? movie.subtitles[0].startSeconds
                : (movie.subtitles[movie.lastDisplayedIndex + 1].startSeconds - movie.subtitles[movie.lastDisplayedIndex].startSeconds);

            setTimerId(window.setTimeout(() => {
                movie.lastDisplayedIndex++;
                localStorage.setItem('currentIndex', movie.lastDisplayedIndex.toString());
                showSubs(movie);
            }, interval * 1000));
        } else {
            stopTimer();
        }
    }

    return <div className="MovieComponent">
        <div>
        {
            isStarted
                ? <button onClick={stopTimer}>Stop</button>
                : <button onClick={() => startTimer()}>Start</button>
        }
        </div>
        <div>{currentSubText}</div>
    </div>
};

export default MovieComponent;
