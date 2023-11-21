import React, { useEffect, useState } from 'react';
import './MovieComponent.css';
import { useParams, useSubmit } from 'react-router-dom';
import Parser from 'srt-parser-2';

interface ISubtitles {
    id: string;
    startTime: string;
    startSeconds: number;
    endTime: string;
    endSeconds: number;
    text: string;
}

const MovieComponent: React.FC = () => {
    const params = useParams();
    const [isStarted, setIsStarted] = useState<boolean>(false);
    const [currentSubText, setCurrentSubText] = useState<string>('');
    const [currentSubIndex, setCurrentSubIndex] = useState<number>(0);
    const [timerId, setTimerId] = useState<number>(0);

    useEffect(() => {
        const subs = getSubs();
        if (!subs) {
            return;
        }

        const isStarted = localStorage.getItem('isStarted') === "1";
        setIsStarted(isStarted);

        if (!isStarted) {
            return;
        }

        const startDate = Number.parseInt(localStorage.getItem('startDate') ?? '0');
        if (!startDate) {
            return;
        }

        const currentIndex = Number.parseInt(localStorage.getItem('currentIndex') ?? '-1');

        showSubs(subs, currentIndex, startDate);
    }, []);

    const startTimer = (): void => {
        localStorage.setItem('isStarted', '1');
        localStorage.setItem('startDate', new Date().getTime().toString());
        setIsStarted(true);

        const subs = getSubs();

        if (subs) {
            showSubs(subs, -1);
        }
    };

    const stopTimer = (): void => {
        localStorage.setItem('isStarted', '0');
        setIsStarted(false);
        window.clearTimeout(timerId);
        setCurrentSubText('');
    };

    const getSubs = (): ISubtitles[] | undefined => {
        const parser = new Parser();
        const subtitles = localStorage.getItem(getSubsKey());

        return subtitles
            ? parser.fromSrt(subtitles)
            : undefined;
    }

    const getSubsKey = (): string => {
        return `movie:${params.id}`;
    }

    const showSubs = (subtitles: ISubtitles[], index: number, startTimestamp?:number): void => {
        if (!subtitles) {
            return;
        }

        if (startTimestamp) {
            index = subtitles.findIndex(x => (startTimestamp + x.startSeconds * 1000) >= new Date().getTime());
            if (timerId) {
                window.clearTimeout(timerId);
            }
        }

        if (index > -1) {
            setCurrentSubText(subtitles[index].text);
        }

        if (index < subtitles.length - 1) {
            const interval = index === -1
                ? subtitles[0].startSeconds
                : (subtitles[index + 1].startSeconds - subtitles[index].startSeconds);

            setTimerId(window.setTimeout(() => {
                index++;
                localStorage.setItem('currentIndex', index.toString());
                showSubs(subtitles, index);
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
                : <button onClick={startTimer}>Start</button>
        }
        </div>
        <div>{currentSubText}</div>
    </div>
};

export default MovieComponent;
