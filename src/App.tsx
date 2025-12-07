import {
	BrowserRouter,
	Route,
	Routes,
} from 'react-router-dom';
import "./App.css"
import Register from './Pags/Register.tsx';
import TwoFA from './Pags/twoFA.tsx';
import Login from './Pags/logIn.tsx';
import Home from './Pags/home.tsx';
import SearchPage from './Pags/searchPage.tsx';
import Details from './Pags/details.tsx';
import Menu from './Pags/menu.tsx';

const router = () => {

	return (
		<BrowserRouter>
			<Routes>
				{/*home*/}
				<Route path="/" element={ <Home /> } />
				<Route path="/search/:query" element={<SearchPage/>} />
				<Route path="/product/:id" element={ <Details/> } />
				<Route path="/menu" element={ <Menu /> } />

				{/*auth routes*/}
				<Route path="/register" element={ <Register /> } />
				<Route path="/logIn" element={ <Login /> } />
				<Route path="/2fa/:email" element={ <TwoFA /> } />

				{/*user routes*/}
				<Route path="/settings" element={<div></div>} />
			</Routes>
		</BrowserRouter>
	);
};

export default router;