import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddMovieComponent from './components/AddMovieComponent/AddMovieComponent';
import MovieListComponent from './components/MovieListComponent/MovieListComponent';
import MovieComponent from './components/MovieComponent/MovieComponent';

const App: React.FC = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<MovieListComponent />} />
			<Route path="/add" element={<AddMovieComponent />} />
			<Route path="/movie/:id" element={<MovieComponent />} />
		</Routes>
	</BrowserRouter>
);

export default App;