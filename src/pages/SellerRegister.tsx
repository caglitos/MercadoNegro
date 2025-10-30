import React, { useState } from 'react';
import './Page.css';

function SellerRegister() {
	const [formData, setFormData] = useState({
		businessName: '',
		businessDescription: '',
		taxId: '',
		phoneNumber: '',
		address: '',
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Implement API call to seller register endpoint
		console.log('Seller register form submitted:', formData);
	};

	return (
		<div className="page-container">
			<h1>Seller Registration</h1>
			<p>Register as a seller to start selling on MercadoNegro.</p>
			<form className="form" onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="businessName">Business Name</label>
					<input
						type="text"
						id="businessName"
						name="businessName"
						value={formData.businessName}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="businessDescription">Business Description</label>
					<textarea
						id="businessDescription"
						name="businessDescription"
						value={formData.businessDescription}
						onChange={handleChange}
						rows={4}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="taxId">Tax ID</label>
					<input
						type="text"
						id="taxId"
						name="taxId"
						value={formData.taxId}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="phoneNumber">Phone Number</label>
					<input
						type="tel"
						id="phoneNumber"
						name="phoneNumber"
						value={formData.phoneNumber}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="address">Address</label>
					<input
						type="text"
						id="address"
						name="address"
						value={formData.address}
						onChange={handleChange}
						required
					/>
				</div>
				<button type="submit" className="btn">
					Register as Seller
				</button>
			</form>
		</div>
	);
}

export default SellerRegister;
