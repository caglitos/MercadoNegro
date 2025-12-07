import { FC } from 'react';


const Menu: FC = () => {
	return (<>
		<h1>Menu de navegacion</h1>
		<p>
			<a href={'/'}> Inicio</a>
		</p>
		<p>
			<a href={'/search'}>Buscar</a>
		</p>
		<p><a href="/register">rR'egistro</a></p>
		<p><a href="/login">Iniciar Sesion</a></p>
		<p>
			<a href={'/menu'}>Menu</a>
		</p>
		<p>
			<a href="/settings">Ajustes</a>
		</p>
	</>);
};

export default Menu;