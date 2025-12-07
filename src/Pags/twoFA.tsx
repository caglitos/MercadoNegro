import TwoFALine from '../Organisms/twoFALine.tsx';
import BigButton from '../Organisms/BigButton.tsx';
import './css/twoFa.css';

const TwoFA = () => {

	const sendToAPI = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		// Get all inputs and concatenate their values
		const inputs = document.querySelectorAll<HTMLInputElement>('.two-fa input');
		const codeInput = Array.from(inputs).map(input => input.value).join('');
		const emailMatch = window.location.pathname.match(/email=([^&]+)/);
		const email = emailMatch ? decodeURIComponent(emailMatch[1]) : null;

		try {
			fetch('http://localhost:3000/api/user/verify-2fa', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					code: codeInput.toUpperCase(),
					email,
				}),
			})
				.then(response => response.json())
				.then(data => {
					console.log(data);
					window.location.href = `/`;
				}).catch((error) => {
				console.error('Error:', error);
				alert('Error al conectar con el servidor');
			});
		} catch (error) {
			alert('error');
			console.log(error);
		}
	};

	return (<div className={'max-size center'}>
		<form className={'column gap-40 center two-fa-pag'}>
			<h1>Introduce el codigo que enviamos a tu email</h1>
			<TwoFALine />
			<BigButton onClick={sendToAPI} children={'Verificar'} />
		</form>
	</div>);
};


export default TwoFA;