import React, { useState } from 'react';
import './Page.css';

function Profile() {
	const [userData, setUserData] = useState({
		username: 'john_doe',
		email: 'john@example.com',
		bio: 'This is my profile bio.',
	});

	const [isEditing, setIsEditing] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setUserData({
			...userData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Implement API call to update profile endpoint
		console.log('Profile update submitted:', userData);
		setIsEditing(false);
	};

	return (
		<div className="page-container">
			<h1>Profile</h1>
			{!isEditing ? (
				<div className="profile-view">
					<div className="profile-field">
						<strong>Username:</strong> {userData.username}
					</div>
					<div className="profile-field">
						<strong>Email:</strong> {userData.email}
					</div>
					<div className="profile-field">
						<strong>Bio:</strong> {userData.bio}
					</div>
					<button className="btn" onClick={() => setIsEditing(true)}>
						Edit Profile
					</button>
				</div>
			) : (
				<form className="form" onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="username">Username</label>
						<input
							type="text"
							id="username"
							name="username"
							value={userData.username}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							id="email"
							name="email"
							value={userData.email}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="bio">Bio</label>
						<textarea
							id="bio"
							name="bio"
							value={userData.bio}
							onChange={handleChange}
							rows={4}
						/>
					</div>
					<div className="btn-group">
						<button type="submit" className="btn">
							Save Changes
						</button>
						<button
							type="button"
							className="btn btn-secondary"
							onClick={() => setIsEditing(false)}
						>
							Cancel
						</button>
					</div>
				</form>
			)}
		</div>
	);
}

export default Profile;
