import "./css/Settings&Burger.css"
import { useEffect, useState } from 'react';

const SettingsBurger = () => {
	const [profile, setProfile] = useState<object>({})
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | object | null>(null)

	useEffect(() => {
		const controller = new AbortController();

		const fetchProfile = async () => {
			try {
				setLoading(true);
				const res = await fetch('http://localhost:3000/api/user/profile', {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
					signal: controller.signal,
				});

				const data = await res.json();

				if (!res.ok) return setError(data);

				setProfile(data);
				setError(null);
			} catch (err: unknown) {
				if (err instanceof Error) {
					if (err.name === 'AbortError') return;
					console.error('Error fetching:', err);
				} else {
					console.error('Error fetching:', err);
				}
				setError(err instanceof Error ? err.message : 'Unknown error');
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();

		return () => controller.abort();
	}, []);

	console.log(profile, loading, error);

	const handleReturn = () => {
		return (
			<div className="SettingsBurger">
				<button className="burger" onClick={redirectToLogin}>
					Inicia sesion
				</button>
				<button className="burger" onClick={redirectToRegister}>
					Registro
				</button>
			</div>
		)
	}

	if (loading) return handleReturn()

	if (!profile)  return handleReturn();

	if (error) return handleReturn();

	if (profile) return (
		<div className="SettingsBurger">
			<button className="burger" onClick={redirectToSettings}>
				<img src="/public/setting-icon.svg" alt="Settings" />
			</button>
			<button className="burger" onClick={redirectToBurgerMenu}>
				<img src="/public/burger-icon.svg" alt="Settings" />
			</button>
		</div>
	)
}

const redirectToLogin = () => {
	window.location.href = "/logIn";
}

const redirectToRegister = () => {
	window.location.href = "/register";
}

const redirectToSettings = () => {
	window.location.href = "/settings";
}

const redirectToBurgerMenu = () => {
	window.location.href = "/menu";
}

export default SettingsBurger;