import './css/details.css';
import React, { useEffect, useState } from 'react';
import ImageCarousel from '../Organisms/imageCarousel';
import AppMenu from '../Templates/app-menu.tsx';
import Search from '../molecules/search.tsx';
import Footer from '../Organisms/footer.tsx';
import ProductCard from '../Organisms/productCard.tsx';

type Post = {
	id: string;
	product_id: string;
	title: string;
	price: number;
}

const DetailsPage: React.FC = () => {
	const ownerId = window.location.pathname.split('/')[2];

	const decodedOwnerId = decodeURIComponent(ownerId ?? '');

	const [title, setTitle] = useState<string>('Cargando titulo...');
	const [subtitle, setSubtitle] = useState<string>('Cargando subtitulo...');
	const [shortDescription, setShortDescription] = useState<string>('Cargando descripción...');
	const [longDescription, setLongDescription] = useState<string>('Cargando descripción...');

	useEffect(() => {
		const controller = new AbortController();

		const fetchProductDetails = async () => {
			try {
				const res = await fetch(`http://localhost:3000/api/product/getByID/${encodeURIComponent(decodedOwnerId)}`, {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
					signal: controller.signal,
				});

				if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

				const data: {
					product: { title: string; subtitle: string; short_description: string, long_description: string }
				} = await res.json();

				setTitle(data.product.title);
				setSubtitle(data.product.subtitle);
				setShortDescription(data.product.short_description);
				setLongDescription(data.product.long_description);
			} catch (err: unknown) {
				if (err instanceof Error) {
					if (err.name === 'AbortError') return;
					console.error('Error fetching product details:', err);
				} else {
					console.error('Error fetching product details:', err);
				}
			}
		};

		fetchProductDetails();

		return () => controller.abort();
	}, []);

	const [price, setPrice] = useState<number>(0);

	useEffect(() => {
		const controller = new AbortController();

		const fetchPrice = async () => {
			try {
				const res = await fetch(`http://localhost:3000/api/post/getByProduct/${encodeURIComponent(decodedOwnerId)}`, {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
					signal: controller.signal,
				});

				if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

				const data: { post: [ { price: number, title: string } ]} = await res.json();

				setPrice(data.post[0].price);
			} catch (err: unknown) {
				if (err instanceof Error) {
					if (err.name === 'AbortError') return;
					console.error('Error fetching price:', err);
				} else {
					console.error('Error fetching price:', err);
				}
			}
		};

		fetchPrice();

		return () => controller.abort();
	}, [] );



	const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
	const [posts, setPosts] = useState<Post[]>([]);
	const [errorPosts, setErrorPosts] = useState<string | null>(null);

	useEffect(() => {
		const controller = new AbortController();

		const fetchPosts = async () => {
			try {
				setLoadingPosts(true);
				const res = await fetch('http://localhost:3000/api/post/randomPosts', {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
					signal: controller.signal,
				});

				if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

				const data: { posts: Post[] } = await res.json();

				setPosts(data.posts);
			} catch (err: unknown) {
				if (err instanceof Error) {
					if (err.name === 'AbortError') return;
					console.error('Error fetching:', err);
					setErrorPosts(err.message);
				} else {
					console.error('Error fetching:', err);
					setErrorPosts('Unknown error');
				}
			} finally {
				setLoadingPosts(false);
			}
		};

		fetchPosts();

		return () => controller.abort();
	}, []);

	const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
	const [titles, setTitles] = useState<string[]>([]);
	const [subtitiles, setSubtitles] = useState<string[]>([]);
	const [errorProducts, setErrorProducts] = useState<string | null>(null);

	useEffect(() => {
		if (posts.length === 0) {
			setLoadingProducts(false);
			return;
		}

		const controller = new AbortController();

		const fetchProducts = async () => {
			try {
				setLoadingProducts(true);
				const newTitles: string[] = [];
				const newSubtitles: string[] = [];

				for (let i = 0; i < posts.length; i++) {
					const res = await fetch("http://localhost:3000/api/product/getByID/" + posts[i].product_id, {
						method: 'GET',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/json',
						},
						signal: controller.signal,
					});

					if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

					const data = await res.json();

					newTitles.push(data.product.title);
					newSubtitles.push(data.product.subtitle);
				}

				setTitles(newTitles);
				setSubtitles(newSubtitles);
			} catch (err: unknown) {
				if (err instanceof Error) {
					if (err.name === 'AbortError') return;
					console.error('Error fetching products:', err);
					setErrorProducts(err.message);
				} else {
					console.error('Error fetching products:', err);
					setErrorProducts('Unknown error');
				}
			} finally {
				setLoadingProducts(false);
			}
		};

		fetchProducts();

		return () => controller.abort();
	}, [posts]);


	if (loadingPosts || loadingProducts) return <>
		<AppMenu />
		<Search />
		<div className={'column'}>
			<span className="offers">Ofertas</span>
			<div className="row carousel margin-bottom-250">
				<>
					<ProductCard
						productId={''}
						productTitle={'titulo'}
						productPrice={0.0}
					/>
					<ProductCard
						productId={''}
						productTitle={''}
						productPrice={0.0}
					/>
					<ProductCard
						productId={''}
						productTitle={''}
						productPrice={0.0}
					/>
				</>
			</div>
			<span className="offers">Normal</span>
			<div className="row carousel margin-bottom-250">
				<>
					<ProductCard
						productId={''}
						productTitle={'titulo'}
						productPrice={0.0}
					/>
					<ProductCard
						productId={''}
						productTitle={''}
						productPrice={0.0}
					/>
					<ProductCard
						productId={''}
						productTitle={''}
						productPrice={0.0}
					/>
				</>
			</div>
			<span className="offers">Recientes</span>
			<div className="row carousel margin-bottom-250">
				<>
					<ProductCard
						productId={''}
						productTitle={'titulo'}
						productPrice={0.0}
					/>
					<ProductCard
						productId={''}
						productTitle={''}
						productPrice={0.0}
					/>
					<ProductCard
						productId={''}
						productTitle={''}
						productPrice={0.0}
					/>
				</>
			</div>

		</div>

		<Footer />
	</>;
	if (errorPosts || errorProducts) return <div>Error loading {errorPosts} {errorProducts}</div>;

	return (
		<div>
			<AppMenu />
			<Search />
			<div className={'row'}>
				<div className={'left'} style={{
					width: '60%',
				}}>
					<ImageCarousel OwnerId={decodedOwnerId} />
				</div>
				<div className={'right max-size'}>
					<div className="column">
						<span className="product-title right">{title}</span>
						<span className="product-subtitle right">{subtitle}</span>
						<span className={'product-price right'}>${price}</span>
						<section className="description">
							<h2 className="description-title">Descripción del producto</h2>
							<p className="description-text">
								{shortDescription} <br/>
								{longDescription}
							</p>
						</section>
					</div>
				</div>
			</div>
			<div className={'column'}>
				<span className="offers">Ofertas</span>
				<div className="row carousel margin-bottom-250">
					{posts.slice(0, 3).map((post, index) => (
						<ProductCard
							productId={post.product_id}
							productTitle={titles[index] || post.title}
							productSubTitle={subtitiles[index] || ''}
							productPrice={post.price}
						/>
					))}
				</div>
				<span className="offers">Normal</span>
				<div className="row carousel margin-bottom-250">
					{posts.slice(3, 6).map((post, index) => (
						<ProductCard
							productId={post.product_id}
							productTitle={titles[index + 3] || post.title}
							productSubTitle={subtitiles[index + 3] || ''}
							productPrice={post.price}
						/>
					))}
				</div>
				<span className="offers">Recientes</span>
				<div className="row carousel margin-bottom-250">
					{posts.slice(6, 9).map((post, index) => (
						<ProductCard
							productId={post.product_id}
							productTitle={titles[index + 6] || post.title}
							productSubTitle={subtitiles[index + 6] || ''}
							productPrice={post.price}
						/>
					))}
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default DetailsPage;