const subtitlesPrefix = 'movie:subtitles:';
const infoPrefix = 'movie:info:';

export function getSubtitlesKey(id: string) {
    return subtitlesPrefix + id;
}

export function isMovieInfoItem(s: string) {
    return s.startsWith(infoPrefix);
}

export function getMovieId(s: string) {
    return s.substring(infoPrefix.length);
}