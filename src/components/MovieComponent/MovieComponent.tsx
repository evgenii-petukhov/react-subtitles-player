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
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [subs, setSubs] = useState<ISubtitles[] | null>(null);
    const [currentSubIndex, setCurrentSubIndex] = useState<number>(-1);
    const [currentSubText, setCurrentSubText] = useState<string | null>(null);

    useEffect(() => {
        setIsStarted(localStorage.getItem('isStarted') === "1");
        const startDate = localStorage.getItem('startDate');
        if (startDate) {
            setStartDate(new Date(Number.parseInt(startDate)));
        }
    }, []);

    const startTimer = (): void => {
        localStorage.setItem('isStarted', '1');
        localStorage.setItem('startDate', new Date().getTime().toString());
        setIsStarted(true);

        const subtitles = getSubtitles(`movie:${params.id}`);

        if (subtitles) {
            setSubs(subtitles);
            showNextSub(subtitles, -1);
        }
    };

    const stopTimer = (): void => {
        localStorage.setItem('isStarted', '0');
        setIsStarted(false);
    };

    function getSubtitles(key: string): ISubtitles[] | null {
        const parser = new Parser();
        const subtitles = localStorage.getItem(key);

        return subtitles
            ? parser.fromSrt(subtitles)
            : null;
    }

    function showNextSub(subtitles: ISubtitles[], index: number) {
        if (!subtitles) {
            return;
        }

        if (index > -1) {
            setCurrentSubText(subtitles[index].text);
        }

        if (index < subtitles.length - 1) {
            const interval = index === -1
                ? subtitles[0].startSeconds
                : (subtitles[index + 1].startSeconds - subtitles[index].startSeconds);

            setTimeout(() => {
                showNextSub(subtitles, index + 1);
            }, interval * 1000);
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
