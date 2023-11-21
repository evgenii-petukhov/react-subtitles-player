import React, { useEffect, useState } from 'react';
import './MovieListComponent.css';
import { Link } from 'react-router-dom';

const MovieListComponent: React.FC = () => {
    const [movies, setMovies] = useState<string[]>([]);

    useEffect(() => {
        const movieList = [];

        for (var key in localStorage) {
            if (localStorage.getItem(key) && key.startsWith('movie:')) {
                movieList.push(key.substring(6));
            }
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
                movies.map(movie => <li key={movie}>
                    <Link to={`/movie/${movie}`}>{movie}</Link>
                </li>)
            }
            </ol>
        </div>
    </div>
};

export default MovieListComponent;
