import React, { useEffect, useRef, useState } from 'react';
import './MovieComponent.scss';
import { useParams } from 'react-router-dom';
import FooterComponent from '../FooterComponent/FooterComponent';
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
    const [currentSubText, setCurrentSubText] = useState<string>('');
    const [subtitleChangeTimerId, setSubtitleChangeTimerId] = useState<number>(0);
    const [hideToolbarTimerId, setHideToolbarTimerId] = useState<number>(0);
    const [isToolbarShown, setIsToolbarShown] = useState<boolean>(true);
    const playInfoRef = useRef<IPlayInfo>({
        isStarted: false,
        startTimestamp: 0,
        rewindMs: 0
    });
    const subtitlesRef = useRef<ISubtitle[]>([]);

    const playInfoPrefix = 'movie:playinfo:';

    useEffect(() => {
        if (!params.id) {
            return;
        }

        const playInfo = getPlayInfo();

        if (!playInfo) {
            return;
        }

        playInfoRef.current = playInfo;

        subtitlesRef.current = JSON.parse(localStorage.getItem(getSubtitlesKey(params.id)) ?? '[]') as ISubtitle[];

        if (subtitlesRef.current && playInfo && playInfo.isStarted) {
            startTimer();
        }

        hideToolbar();
    }, []);

    const startTimer = (): void => {
        const index = playInfoRef.current.isStarted ? getIndex() : -1;

        if (!playInfoRef.current.isStarted) {
            playInfoRef.current = {
                startTimestamp: new Date().getTime(),
                rewindMs: 0,
                isStarted: true
            }
        }

        localStorage.setItem(getPlayInfoKey(), JSON.stringify(playInfoRef.current));
        showSubs(index);
    };

    const stopTimer = (playInfo?: IPlayInfo): void => {
        playInfoRef.current.isStarted = false;
        playInfoRef.current.rewindMs = 0;
        localStorage.setItem(getPlayInfoKey(), JSON.stringify(playInfo));
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

    const showSubs = (index: number): void => {
        if (!playInfoRef.current.isStarted || !playInfoRef.current.startTimestamp) {
            return;
        }

        if (index > -1) {
            setCurrentSubText(subtitlesRef.current[index].text);
        }

        if (index < subtitlesRef.current.length - 1) {
            setSubtitleChangeTimerId(window.setTimeout(() => {
                index++;
                showSubs(index);
            }, getTimeTillSubtitleByIndex(index + 1)));
        } else {
            stopTimer(playInfoRef.current);
        }
    }

    const rewind = (seconds: number): void => {
        window.clearTimeout(subtitleChangeTimerId);
        playInfoRef.current.rewindMs += seconds * 1000;
        localStorage.setItem(getPlayInfoKey(), JSON.stringify(playInfoRef.current));
        showSubs(getIndex());
    };

    const getIndex = (): number => {
        const index = subtitlesRef.current.findIndex((_, index) => getTimeTillSubtitleByIndex(index));
        return index > -1 ? index - 1 : -1;
    };

    const getTimeTillSubtitleByIndex = (index: number): number => {
        return subtitlesRef.current[index].startSeconds * 1000
            - new Date().getTime()
            + playInfoRef.current.startTimestamp
            + playInfoRef.current.rewindMs;
    }

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
                    playInfoRef.current.isStarted && <>
                        <button className='btn btn-dark' onClick={() => rewind(30)}>&#8722;30s</button>
                        <button className='btn btn-dark' onClick={() => rewind(5)}>&#8722;5s</button>
                    </>
                }
                {
                    playInfoRef.current.isStarted
                        ? <button className='btn btn-dark' onClick={() => stopTimer()}>Stop</button>
                        : <button className='btn btn-dark' onClick={() => startTimer()}>Start</button>
                }
                {
                    playInfoRef.current.isStarted && <>
                        <button className='btn btn-dark' onClick={() => rewind(-5)}>+5s</button>
                        <button className='btn btn-dark' onClick={() => rewind(-30)}>+30s</button>
                    </>
                }
            </div>
            <div className='text-container'>
                <div className='text'>{currentSubText}</div>
            </div>
            <FooterComponent isToolbarShown={isToolbarShown} isExitButtonShown={true}>
                <button className='btn btn-dark' onClick={() => enterFullscreen()}>Fullscreen</button>
            </FooterComponent>
        </FullScreen>
    </div>
};

export default MovieComponent;
