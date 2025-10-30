import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import TwoFA from './pages/TwoFA';
import SellerRegister from './pages/SellerRegister';
import Profile from './pages/Profile';
import './App.css';

function App() {
	return (
		<Router>
			<div className="app-container">
				<nav className="nav">
					<Link to="/" className="nav-link">
						Home
					</Link>
					<Link to="/register" className="nav-link">
						Register
					</Link>
					<Link to="/login" className="nav-link">
						Login
					</Link>
					<Link to="/2fa" className="nav-link">
						2FA
					</Link>
					<Link to="/seller-register" className="nav-link">
						Seller Register
					</Link>
					<Link to="/profile" className="nav-link">
						Profile
					</Link>
				</nav>

				<div className="route-outlet">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/register" element={<Register />} />
						<Route path="/login" element={<Login />} />
						<Route path="/2fa" element={<TwoFA />} />
						<Route path="/seller-register" element={<SellerRegister />} />
						<Route path="/profile" element={<Profile />} />
					</Routes>
				</div>
			</div>
		</Router>
	);
}

export default App;
