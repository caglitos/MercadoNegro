import './css/image.css';
import React from 'react';

type ImageProps = {
	url?: string,
	altText: string,
	size?: number,
	selected?: boolean
}

const Image: React.FC<ImageProps> = ({ url, altText, size, selected }) => {
	const [hasError, setHasError] = React.useState(false);

	let classes = 'large';

	if (size === 1) {
		classes = 'small';
		if (selected) {
			classes = 'small selected';
		}
	} else if (size === 0) {
		classes = 'smaller';
		if (selected) {
			classes = 'smaller selected';
		}
	}

	if (!url || hasError) {
		return (
			<div className={classes + " imagen placeholder"}>
				<span>{altText}</span>
			</div>
		);
	}

	return (
		<img
			src={url}
			className={classes + " imagen"}
			alt={altText}
			onError={() => setHasError(true)}
		/>
	);
};

export default Image;