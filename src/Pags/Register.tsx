import "./css/Register.css";
import AppMenu from '../Templates/app-menu.tsx';
import BigInput from "../molecules/BigInput.tsx";
import BigButton from '../Organisms/BigButton.tsx';
import Footer from '../Organisms/footer.tsx';

const Register = () => {
	const registerFetch = async () => {
		const username = (document.getElementById("Username") as HTMLInputElement).value;
		const email = (document.getElementById("Email") as HTMLInputElement).value;
		const password = (document.getElementById("Password") as HTMLInputElement).value;
		const confirmPassword = (document.getElementById("Confirm Password") as HTMLInputElement).value;
		const publicName = (document.getElementById("Public Name") as HTMLInputElement).value;

		if (password !== confirmPassword) {
			alert("Las contraseñas no coinciden");
			return;
		}

		try {
			fetch('http://localhost:3000/api/user/register', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username,
					email,
					password,
					publicName
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
			<div className="register-container">
				<div className="left-side">
					<h1 className="register-title">
						Crea<br/>
						tu nueva<br/>
						cuenta
					</h1>
					<div className="column">
						<BigButton className={""} children={"Crear cuenta"} onClick={registerFetch} />
						<a className={"login-href center"} href={"./login"}>Ya tienes una cuenta, Inicia Sesion</a>
					</div>
				</div>

				<form className="register-form">
					<BigInput id={"Username"} placeHolder={"Username"}/>
					<BigInput id={"Email"} placeHolder={"Email"}/>
					<BigInput id={"Password"} type={"password"} placeHolder={"Password"}/>
					<BigInput id={"Confirm Password"} type={"password"} placeHolder={"Confirm Password"}/>
					<BigInput id={"Public Name"} placeHolder={"Public Name"}/>
				</form>
			</div>
			<Footer/>

		</div>
	);
}

export default Register;