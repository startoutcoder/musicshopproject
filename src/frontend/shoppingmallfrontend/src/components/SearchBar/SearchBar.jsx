import React, { useState, useEffect } from 'react';
import useDebounce from '../../hooks/useDebounce';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const debouncedSearchTerm = useDebounce(searchTerm, 100); // 400ms delay

    useEffect(() => {
        onSearch(debouncedSearchTerm);
    }, [debouncedSearchTerm, onSearch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <form className="searchbar-form" onSubmit={handleSubmit}>
            <input
                type="text"
                className="searchbar-input"
                placeholder={placeholder || "Search..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </form>
    );
};

export default SearchBar;