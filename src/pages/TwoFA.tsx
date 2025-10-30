import React, { useState } from 'react';
import './Page.css';

function TwoFA() {
	const [code, setCode] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Implement API call to 2FA verification endpoint
		console.log('2FA code submitted:', code);
	};

	return (
		<div className="page-container">
			<h1>Two-Factor Authentication</h1>
			<p>Enter the 6-digit code from your authenticator app.</p>
			<form className="form" onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="code">Verification Code</label>
					<input
						type="text"
						id="code"
						name="code"
						value={code}
						onChange={(e) => setCode(e.target.value)}
						maxLength={6}
						pattern="[0-9]{6}"
						placeholder="123456"
						required
					/>
				</div>
				<button type="submit" className="btn">
					Verify
				</button>
			</form>
		</div>
	);
}

export default TwoFA;
