import React, { useEffect, useState } from 'react';
import './MovieListComponent.css';
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
        <div className='toolbar'>
            <Link to={`/add`}>
                <button>Add new</button>
            </Link>
        </div>
        <div className='movie-list'>
            <ol>
            {
                movies.map(movie => <li key={movie.id}>
                    <Link to={`/movie/${movie.id}`}>{movie.name}</Link>
                </li>)
            }
            </ol>
        </div>
    </div>
};

export default MovieListComponent;
