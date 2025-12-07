import './css/twoFAInput.css';

const TwoFAInput = () => {
	const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
		const input = e.currentTarget;

		if (input.value.length === 1) {
			// Get all focusable elements
			const focusableElements = document.querySelectorAll<HTMLElement>(
				'input, button, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
			);
			const focusableArray = Array.from(focusableElements);
			const currentIndex = focusableArray.indexOf(input);

			// Focus on the next focusable element
			if (currentIndex !== -1 && currentIndex < focusableArray.length - 1) {
				focusableArray[currentIndex + 1].focus();
			}
		}
	};

	return <div className="two-fa">
		<input
			type="text"
			maxLength={1}
			onInput={handleInput}
		/>
	</div>;
};

export default TwoFAInput;