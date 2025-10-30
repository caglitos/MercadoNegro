import React, { useState } from 'react';
import './Page.css';

function Login() {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Implement API call to login endpoint
		console.log('Login form submitted:', formData);
	};

	return (
		<div className="page-container">
			<h1>Login</h1>
			<form className="form" onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>
				<button type="submit" className="btn">
					Login
				</button>
			</form>
		</div>
	);
}

export default Login;
