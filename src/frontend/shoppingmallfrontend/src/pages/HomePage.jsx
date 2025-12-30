import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import ProductCard from '../components/ProductCard/ProductCard';
import SearchBar from "../components/SearchBar/SearchBar.jsx";
import './HomePage.css';

const categories = ['All', 'Rock', 'Pop', 'Jazz', 'Classical', 'Hip Hop'];

function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Fixed typo: seterror -> setError
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [allProducts, setAllProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [activeQuery, setActiveQuery] = useState('');

    useEffect(() => {
        const fetchFeatured = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/products');
                // We'll just show the first 4 products as featured
                setFeaturedProducts(response.data.slice(0, 4));
                setError(null);
            } catch (err) {
                console.error("Could not fetch featured products:", err);
                setError("Could not load featured products.");
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    useEffect(() => {
        if (activeQuery) {
            setIsSearching(true);
            api.get(`/api/products/search/all?query=${activeQuery}`)
                .then(response => {
                    setSearchResults(response.data);
                })
                .catch(err => console.error("Search failed:", err))
                .finally(() => setIsSearching(false));
        } else {
            setSearchResults([]);
        }
    }, [activeQuery]);

    const productsToDisplay = activeQuery ? searchResults : featuredProducts;

    return (
        <div className="homepage">
            <section className="hero-section">
                <h1 className="hero-title">Buy, Rate And Share Music.</h1>
                <p className="hero-subtitle">
                    Discover new releases and timeless classics from genres around the world.
                </p>
                <Link to="/products" className="cta-button">
                    Explore All Albums
                </Link>
            </section>

            <section className="featured-products">
                <div className="section-header">
                    <h2 className="section-title">
                        {activeQuery ? `Search Results for "${activeQuery}"` : 'Featured Releases'}
                    </h2>
                    <SearchBar
                        onSearch={setActiveQuery}
                        placeholder="Search albums, artists, genres..."
                    />
                </div>

                {loading && <p>Loading...</p>}
                {error && <p style={{color: 'red'}}>{error}</p>}

                {!loading && !error && (
                    <div className="product-grid">
                        {isSearching ? (
                            <p>Searching...</p>
                        ) : productsToDisplay.length > 0 ? (
                            productsToDisplay.map(product => (
                                <ProductCard key={product.productId} product={product} />
                            ))
                        ) : (
                            activeQuery && <p>No results found.</p>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}

export default HomePage;