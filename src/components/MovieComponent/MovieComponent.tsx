import React, { useEffect, useRef, useState } from 'react';
import './MovieComponent.css';
import { useParams } from 'react-router-dom';
import BackButtonComponent from '../BackButtonComponent/BackButtonComponent';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { getSubtitlesKey } from '../../helpers/localStorageItemNameHelper';

interface ISubtitle {
    id: string;
    startTime: string;
    startSeconds: number;
    endTime: string;
    endSeconds: number;
    text: string;
}

interface IPlayInfo {
    isStarted: boolean;
    startTimestamp: number;
    rewindMs: number;
}

const MovieComponent: React.FC = () => {
    const params = useParams();
    const fullscreen = useFullScreenHandle();
    const [isStarted, setIsStarted] = useState<boolean>(false);
    const [currentSubText, setCurrentSubText] = useState<string>('');
    const [subtitleChangeTimerId, setSubtitleChangeTimerId] = useState<number>(0);
    const [hideToolbarTimerId, setHideToolbarTimerId] = useState<number>(0);
    const [isToolbarShown, setIsToolbarShown] = useState<boolean>(true);
    const subtitlesRef = useRef<ISubtitle[]>([]);

    const playInfoPrefix = 'movie:playinfo:';

    useEffect(() => {
        if (!params.id) {
            return;
        }

        const playInfo = getPlayInfo();

        subtitlesRef.current = JSON.parse(localStorage.getItem(getSubtitlesKey(params.id)) ?? '[]') as ISubtitle[];

        if (subtitlesRef.current && playInfo && playInfo.isStarted) {
            startTimer(playInfo);
        }

        hideToolbar();
    }, []);

    const startTimer = (playInfo?: IPlayInfo): void => {
        var index = -1;

        if (playInfo) {
            index = getIndex(playInfo);
        } else {
            playInfo = getPlayInfo();

            if (!playInfo) {
                return;
            }

            playInfo.startTimestamp = new Date().getTime();
            playInfo.rewindMs = 0;
        }

        playInfo.isStarted = true;
        localStorage.setItem(getPlayInfoKey(), JSON.stringify(playInfo));
        setIsStarted(true);
        showSubs(playInfo, index);
    };

    const stopTimer = (playInfo?: IPlayInfo): void => {
        playInfo = playInfo ?? getPlayInfo();
        if (!playInfo) {
            return;
        }
        playInfo.isStarted = false;
        playInfo.rewindMs = 0;
        localStorage.setItem(getPlayInfoKey(), JSON.stringify(playInfo));
        setIsStarted(false);
        window.clearTimeout(subtitleChangeTimerId);
        setCurrentSubText('');
    };

    const getPlayInfo = (): IPlayInfo | undefined => {
        const playInfo = JSON.parse(localStorage.getItem(getPlayInfoKey()) ?? '{}');

        return playInfo ? {
            isStarted: playInfo.isStarted ?? false,
            startTimestamp: playInfo.startTimestamp ?? 0,
            rewindMs: playInfo.rewindMs ?? 0
        } : undefined;
    }

    const getPlayInfoKey = (): string => {
        return playInfoPrefix + params.id;
    }

    const showSubs = (playInfo: IPlayInfo, index: number): void => {
        if (!playInfo.isStarted || !playInfo.startTimestamp) {
            return;
        }

        if (index > -1) {
            setCurrentSubText(subtitlesRef.current[index].text);
        }

        if (index < subtitlesRef.current.length - 1) {
            const interval = index === -1
                ? subtitlesRef.current[0].startSeconds
                : (subtitlesRef.current[index + 1].startSeconds - subtitlesRef.current[index].startSeconds);

            setSubtitleChangeTimerId(window.setTimeout(() => {
                index++;
                showSubs(playInfo, index);
            }, interval * 1000));
        } else {
            stopTimer(playInfo);
        }
    }

    const rewind = (seconds: number): void => {
        window.clearTimeout(subtitleChangeTimerId);

        const playInfo = getPlayInfo();

        if (!playInfo) {
            return;
        }

        playInfo.rewindMs = playInfo.rewindMs + seconds * 1000;

        localStorage.setItem(getPlayInfoKey(), JSON.stringify(playInfo));

        showSubs(playInfo, getIndex(playInfo));
    };

    const getIndex = (playInfo: IPlayInfo): number => {
        const startTimestamp = playInfo.startTimestamp + playInfo.rewindMs;
        return subtitlesRef.current.findIndex(x => (startTimestamp + x.startSeconds * 1000) >= new Date().getTime());
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

    const enterFullscreen = (): void => {
        if (fullscreen.active) {
            fullscreen.exit();
        } else {
            fullscreen.enter();
        }
    };

    return <div className="MovieComponent" onClick={showToolbar}>
        <FullScreen handle={fullscreen}>
            <div className={`toolbar ${!isToolbarShown && 'hidden'}`}>
                {
                    isStarted && <>
                        <button className='round' onClick={() => rewind(30)}>&#8722;30s</button>
                        <button className='round' onClick={() => rewind(5)}>&#8722;5s</button>
                    </>  
                }
                {
                    isStarted
                        ? <button onClick={() => stopTimer()}>Stop</button>
                        : <button onClick={() => startTimer()}>Start</button>
                }
                {
                    isStarted && <>
                        <button className='round' onClick={() => rewind(-5)}>+5s</button>
                        <button className='round' onClick={() => rewind(-30)}>+30s</button>
                    </>
                }
            </div>
            <div className='text-container'>
                <div className='text'>{currentSubText}</div>
            </div>
            <BackButtonComponent isToolbarShown={isToolbarShown}>
                <button onClick={() => enterFullscreen()}>Fullscreen</button>
            </BackButtonComponent>
        </FullScreen>
    </div>
};

export default MovieComponent;
