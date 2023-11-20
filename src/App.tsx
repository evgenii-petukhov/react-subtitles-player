import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginComponent from './components/LoginComponent/LoginComponent';

const App: React.FC = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<LoginComponent />} />
		</Routes>
	</BrowserRouter>
);

export default App;