import "./css/login.css";
import AppMenu from '../Templates/app-menu.tsx';
import BigInput from "../molecules/BigInput.tsx";
import BigButton from '../Organisms/BigButton.tsx';
import Footer from '../Organisms/footer.tsx';


const LogIn = () => {
	const logInFetch = async () => {
		const email = (document.getElementById("Email") as HTMLInputElement).value;
		const password = (document.getElementById("Password") as HTMLInputElement).value;

		try {
			fetch('http://localhost:3000/api/user/login', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					password,
				}),
			})
				.then(response => response.json())
				.then(data => {
					console.log(data);
					window.location.href = "/2fa/email=" + encodeURIComponent(email);
				})
				.catch((error) => {
					console.error('Error:', error);
					alert("Error al conectar con el servidor");
				});

		} catch (error) {
			console.error('Error:', error);
			alert("Error al conectar con el servidor");
		}
	}

	return (
		<div style={{
			display: "flex",
			flexDirection: "column",
			minHeight: "100vh",
			justifyContent: "space-between",
			overflow: "hidden",
			minWidth: "100vw",
			maxWidth: "100vw",
			maxHeight: "110vh",

		}}>
			<AppMenu />
			<div className="login-container">
				<div className="left-side">
					<h1 className="login-title">
						Introduce tu<br/>
						email y<br/>
						contraseña para<br/>
						iniciar sesion<br/>
					</h1>
					<div className="column">
						<BigButton className={""} children={"iniciar sesion"} onClick={logInFetch} />
						<a className={"register-href center"} href={"./register"}>No tienes una cuenta, Creala</a>
					</div>
				</div>

				<form className="login-form">
					<BigInput id={"Email"} placeHolder={"Email"}/>
					<BigInput id={"Password"} type={"password"} placeHolder={"Password"}/>
				</form>
			</div>
			<Footer/>

		</div>
	);
}

export default LogIn;