import './css/searchPage.css';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AppMenu from '../Templates/app-menu.tsx';
import Footer from '../Organisms/footer.tsx';
import Search from '../molecules/search.tsx';

const SearchPage: React.FC = () => {
	const { query } = useParams();
	const decoded = query ? decodeURIComponent(query) : '';

	const [loadingResults, setLoadingResults] = React.useState<boolean>(true);
	const [results, setResults] = React.useState<never[]>([]);
	const [errorResults, setErrorResults] = React.useState<string | null>(null);

	useEffect(() => {
		const controller = new AbortController();

		const fetchResults = async () => {
			try {
				setLoadingResults(true);
				const fetchUrl = `http://localhost:3000/api/product/search/${encodeURIComponent(decoded)}`;
				const res = await fetch(fetchUrl, {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
					signal: controller.signal,
				});

				if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

				const data: { products: never[] } = await res.json();

				setResults(data.products);
			} catch (err: unknown) {
				if (err instanceof Error) {
					if (err.name === 'AbortError') return;
					console.error('Error fetching:', err);
					setErrorResults(err.message);
				} else {
					console.error('Error fetching:', err);
					setErrorResults('Unknown error');
				}
			} finally {
				setLoadingResults(false);
			}
		};

		fetchResults();


		return () => controller.abort();
	}, [decoded]);

	if (loadingResults) return <>
		<AppMenu />
		<Search text={decoded} />
		<p>Loading search results..</p>
		<Footer />
	</>;
	if (errorResults) return <>
		<AppMenu />
		<Search text={decoded} />
		<p>Error loading search results: {errorResults}</p>
		<Footer />
	</>;
	if (results.length === 0) return <>
		<AppMenu />
		<Search text={decoded} />
		<p>No results found for "{decoded}"</p>
		<Footer />
	</>;

	return <>
		<AppMenu />
		<Search text={decoded} />
		<div className={'row'}>
			<div className={'column gap-60'}>
				<div className={'feature center'}>🔒 Lock Envios Seguros</div>
				<div className={'feature center'}>🌐 Compra Internacional</div>
				<div className={'feature center column'}>
					<span className={'category-filter-title'}>Categorias ⋁</span>
					categoria 0..<br />
					categoria 1..<br />
					categoria 2..<br />
					categoria 3..<br />
					{/*TODO: map de categorías */}
					<span className={'category-filter-title'}>Envios ⋁</span>
					Hoy<br/>
					mañana<br/>
					2-6 días<br/>
					7-15 días<br/>
					{/*TODO: map de tipos de envíos*/}
					<span className={'category-filter-title'}>Precio</span>
					<div className={'price-filter'}>
						<input type="number" className={'price-input'} placeholder={'Min'} />
						<span className={'price-separator'}>-</span>
						<input type="number" className={'price-input'} placeholder={'Max'} />
					</div>


				</div>

			</div>

		</div>
		<Footer />
	</>;
};

export default SearchPage;