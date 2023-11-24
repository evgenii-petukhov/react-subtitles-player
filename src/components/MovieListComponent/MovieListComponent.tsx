import React, { useEffect, useState } from 'react';
import './MovieListComponent.scss';
import { Link } from 'react-router-dom';
import { isMovieInfoItem, getMovieId } from '../../helpers/localStorageItemNameHelper';

interface IMovie {
    id: string;
    name: string;
}

const MovieListComponent: React.FC = () => {
    const [movies, setMovies] = useState<IMovie[]>([]);
    

    useEffect(() => {
        const movieList = [];

        for (var key in localStorage) {
            if (!isMovieInfoItem(key)) {
                continue;
            }

            const info = localStorage.getItem(key);
            if (!info) {
                continue;
            }
            
            movieList.push({
                id: getMovieId(key),
                name: JSON.parse(info).name
            });
        }

        setMovies(movieList);
    }, []);

    return <div className="MovieListComponent">
        <div className='movie-list'>
            <div className="list-group">
                <Link to={`/add`}
                    className='list-group-item list-group-item-action active'>Add subtitles as text</Link>
                {
                    movies.map(movie => <Link key={movie.id}
                        to={`/movie/${movie.id}`}
                        className="list-group-item list-group-item-action">{movie.name}</Link>)
                }
            </div>
        </div>
    </div>
};

export default MovieListComponent;
