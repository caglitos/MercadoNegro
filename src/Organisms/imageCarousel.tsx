import React, { useState, useEffect } from 'react';
import Image from '../molecules/image.tsx';

interface IProps {
	OwnerId: string;
}

const ImageCarousel: React.FC<IProps> = ({ OwnerId }) => {
	const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

	const [loading, setLoading] = useState<boolean>(true);
	const [urls, setUrls] = useState<string[]>([]);
	const [alts, setAlts] = useState<string[]>([]);

	useEffect(() => {
		const controller = new AbortController();

		const fetchImages = async () => {
			try {
				setLoading(true);
				const newUrls: string[] = [];
				const newAlts: string[] = [];

				const res = await fetch(`http://localhost:3000/api/image/getByOwner/${encodeURIComponent(OwnerId)}`, {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
					signal: controller.signal,
				});

				if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

				const data = await res.json();

				data.images.forEach((img: { url: string; alt_text: string }) => {
					newUrls.push(img.url);
					newAlts.push(img.alt_text);
				})

				setUrls(newUrls);
				setAlts(newAlts);
			} catch (err: unknown) {
				if (err instanceof Error) {
					if (err.name === 'AbortError') return;
					console.error('Error fetching images:', err);
				} else {
					console.error('Error fetching images:', err);
				}
			} finally {
				setLoading(false);
			}
		}

		fetchImages()

		return () => controller.abort();
	}, []);

	const images = urls.map((url, idx) => ({
		url,
		altText: alts[idx] || `Image ${idx + 1}`,
		size: 0,
	}));

	if (loading) {
		return <div>Loading images...</div>;
	}

	if (images.length === 0) {
		return <div>No images available.</div>;
	}

	return (
		<div className={'row gap-40'}  >
			<div className={'gap-20 img-scroll'}  style={{
				width: "150px",
				height: "500px",
				overflowY: "auto",
			}}>
				{images.map((img, idx) => (
					<div key={idx} onMouseEnter={() => setSelectedImageIndex(idx)}>
						<Image
							url={img.url}
							altText={img.altText}
							selected={selectedImageIndex === idx}
							size={img.size}
						/>
						<div className={"spacer-30"} />
					</div>
				))}
			</div>
			<div>
				<Image
					url={images[selectedImageIndex].url}
					altText={images[selectedImageIndex].altText}
				/>
			</div>
		</div>
	);
	console.log(OwnerId);
};

export default ImageCarousel;