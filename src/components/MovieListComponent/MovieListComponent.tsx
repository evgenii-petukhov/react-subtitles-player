import React, { useEffect, useState } from 'react';
import './MovieListComponent.scss';
import { Link, useNavigate } from 'react-router-dom';
import { isMovieInfoItem, getMovieId } from '../../helpers/localStorageItemNameHelper';
import FooterComponent from '../FooterComponent/FooterComponent';

interface IMovie {
    id: string;
    name: string;
}

const MovieListComponent: React.FC = () => {
    const [movies, setMovies] = useState<IMovie[]>([]);
    const navigate = useNavigate();

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

        if (!movieList.length) {
            navigate('/add');
            return;
        }

        setMovies(movieList);
    }, []);

    const onRemoveAllClicked = (): void => {
        localStorage.clear();
        navigate('/add');
    };

    return <div className="MovieListComponent">
        <div className="list-group">
            <div className="list-group-item list-group-item-action active" aria-current="true">Select a movie</div>

            {
                movies.map(movie => <Link key={movie.id}
                    to={`/movie/${movie.id}`}
                    className="list-group-item list-group-item-action">{movie.name}</Link>)
            }
        </div>
        <FooterComponent isToolbarShown={true} isExitButtonShown={false}>
            <Link to={`/add`}
                className='btn btn-dark'>Add subtitles as text</Link>
            <button className='btn btn-danger'
                onClick={onRemoveAllClicked}>Remove all</button>
        </FooterComponent>
    </div>
};

export default MovieListComponent;
