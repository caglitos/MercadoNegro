import './css/home.css';
import ProductCard from '../Organisms/productCard.tsx';
import Search from '../molecules/search.tsx';
import AppMenu from '../Templates/app-menu.tsx';
import Footer from '../Organisms/footer.tsx';
import React, { useEffect, useState } from 'react';

type Post = {
	id: string;
	product_id: string;
	title: string;
	price: number;
}

const Home: React.FC = () => {
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


	return <>
		<AppMenu />
		<Search />
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
	</>;
};

export default Home;
