import TwoFAInput from '../molecules/twoFAInput.tsx';
import "./css/twoFALine.css"

const TwoFALine = () => {
	return <div className=" row center gap-20">
		<TwoFAInput />
		<TwoFAInput />
		<TwoFAInput />
		<h1>-</h1>
		<TwoFAInput />
		<TwoFAInput />
		<TwoFAInput />

	</div>
}

export default TwoFALine;