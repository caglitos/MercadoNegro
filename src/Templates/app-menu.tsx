import Line from '../molecules/line.tsx';
import SettingsBurger from '../Organisms/Settings&Burger.tsx';
import './app-menu.css';

const AppMenu = () => {
	return (<>
			<div className="app-menu">
				<button className="app-logo" onClick={redirectToHome}>
					<img src="/public/app-logo.svg" alt="Settings" />
				</button>
				<SettingsBurger />
				<Line />
			</div>
			<div className={"spacer"} />
		</>
	);
};

const redirectToHome = () => {
	window.location.href = '/';
};

export default AppMenu;