import React, { useEffect, useState } from 'react';
import Image from '../molecules/image.tsx';
import './css/productCard.css';

interface productCardProps {
	productId: string,
	productTitle: string,
	productSubTitle?: string,
	productPrice: number,
}

const ProductCard: React.FC<productCardProps> = ({ productId, productPrice, productTitle, productSubTitle }) => {
	const redirect = () => {
		window.location.href = `/product/${productId}`;
	}

	return (
		<a onClick={redirect} className="productCard center column">
			<ImageLoader ownerID={productId} />
			<div className="row centerh max-size">
				<div className={'pad-30 max-size '}>
					<span className="card-title left">{productTitle}</span> <br/>
					<span className="card-subtitle left">{productSubTitle}</span>
				</div>
				<div className="pad-30 max-size">
					<span className="card-price right">$ {productPrice}</span>
				</div>
			</div>
		</a>
	);
};


interface ImageLoaderProps {
	ownerID: string;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({ ownerID }) => {
	const [imgUrl, setImgUrl] = useState<string>('');
	const [altText, setAltText] = useState<string>('Loaded Image');
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const controller = new AbortController();

		const fetchImage = async () => {
			try {
				const fetchUrl = `http://localhost:3000/api/image/getMain/${ownerID}`;

				const res = await fetch(fetchUrl, {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
					signal: controller.signal,
				});

				if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

				const data = await res.json();

				const url = data.images.url;
				const alt = data.images.alt_text ?? 'Loaded Image';

				setImgUrl(url);
				setAltText(alt);
				setError(null);
			} catch (err: unknown) {
				if (err instanceof Error) {
					if (err.name === 'AbortError') return;
					console.error('Error fetching image:', err);
					setError(err.message);
				} else {
					console.error('Error fetching image:', err);
					setError('Unknown error');
				}
			} finally {
				setLoading(false);
			}
		};

		fetchImage();
		return () => controller.abort();
	}, [ownerID]);

	if (loading) return <div style={{
		width: "542px",
		height: "254px",
		backgroundColor: "#e0e0e0"
	}}>Loading image...</div>;
	if (error) return <div style={{
		width: "542px",
		height: "254px",
		backgroundColor: "#e0e0e0"
	}}>No image available</div>;

	if (imgUrl) return <Image selected={false} url={imgUrl} size={1} altText={altText} />;
};

export default ProductCard;