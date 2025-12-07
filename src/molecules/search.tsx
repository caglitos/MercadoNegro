import React, { useState } from 'react';
import './css/search.css';

interface searchProps {
	text?: string;
}

const Search: React.FC<searchProps> = ({text}) => {
	const [query, setQuery] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			window.location.href = '/search/' + encodeURIComponent(query);
		}
	};

	return <div className="center" style={{ height: '177px' }}>
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				id="search-input"
				name={'query'}
				className={'search-input'}
				placeholder={'Search'}
				defaultValue={text}
				onChange={(e) => setQuery(e.target.value)}
			/>
			<img
				className={'search-icon'}
				src={'/public/search.svg'}
				alt={'search'}
				style={{ width: '21px', height: '22px', cursor: 'pointer' }}
				onClick={() => {
					if (query.trim()) {
						window.location.href = '/search/' + encodeURIComponent(query);
					}
				}}
			/>
		</form>
	</div>;
};

export default Search;