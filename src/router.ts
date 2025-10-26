import { mount } from 'ripple';
import Home from './pags/home.ripple';

// Hybrid router: supports both hash (e.g. #/login) and history pathname (e.g. /login)
export function setupRouter() {
	const outlet = document.getElementById('route-outlet');
	if (!outlet) return;

	const getPath = () => {
		const fromHash = location.hash.replace(/^#/, '');
		const raw = fromHash || location.pathname || '/';
		return raw.startsWith('/') ? raw : `/${raw}`;
	};

	const render = () => {
		const path = getPath();

		outlet.replaceChildren();

		if (path === '/') {
			outlet.textContent = 'home page';
			mount(Home, {
				target: outlet
			});
		} else if (path === '/login') {
			outlet.textContent = 'login page';
		} else {
			outlet.textContent = '404';
		}
	};

	window.addEventListener('hashchange', render);
	window.addEventListener('popstate', render);

	render();
}
