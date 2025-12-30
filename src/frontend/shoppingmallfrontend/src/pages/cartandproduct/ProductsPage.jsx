
import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import CategoryItem from '../../components/Category/CategoryItem.jsx';
import SearchBar from '../../components/SearchBar/SearchBar';
import './ProductsPage.css';

function ProductsPage() {
    const [allProducts, setAllProducts] = useState([]);
    const [categoryTree, setCategoryTree] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for search functionality
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [activeQuery, setActiveQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productsResponse, categoriesResponse] = await Promise.all([
                    api.get('/api/products'),
                    api.get('/api/categories')
                ]);
                setAllProducts(productsResponse.data);
                setCategoryTree(categoriesResponse.data);
            } catch (err) {
                setError("Could not load data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (activeQuery) {
            setIsSearching(true);
            api.get(`/api/products/search/all?query=${activeQuery}`)
                .then(response => setSearchResults(response.data))
                .catch(err => console.error("Search failed:", err))
                .finally(() => setIsSearching(false));
        } else {
            setSearchResults([]);
        }
    }, [activeQuery]);

    const getCategoryIds = (category) => {
        let ids = [category.categoryId];
        if (category.children && category.children.length > 0) {
            ids = [...ids, ...category.children.flatMap(getCategoryIds)];
        }
        return ids;
    };

    const productsToDisplay = activeQuery
        ? searchResults
        : selectedCategory
            ? allProducts.filter(p => getCategoryIds(selectedCategory).includes(p.productCategory.categoryId))
            : allProducts;

    return (
        <div className="products-page">
            <div className="products-page-header">
                <h1 className="products-page-title">Our Album Collection</h1>
                <SearchBar onSearch={setActiveQuery} placeholder="Search" />
            </div>

            <div className="products-page-layout">
                <div className="products-grid-container">
                    {loading && <p>Loading...</p>}
                    {error && <p className="page-status error">{error}</p>}
                    {!loading && !error && (
                        <div className="product-grid">
                            {isSearching ? (
                                <p>Searching...</p>
                            ) : productsToDisplay.length > 0 ? (
                                productsToDisplay.map(product => (
                                    <ProductCard key={product.productId} product={product} />
                                ))
                            ) : (
                                <p>No products found for this selection.</p>
                            )}
                        </div>
                    )}
                </div>
                <aside className="sidebar-container">
                    <h2 className="sidebar-title">Genres</h2>
                    <ul className="category-list">
                        <li className={`category-tree-item ${selectedCategory === null ? 'active' : ''}`} onClick={() => setSelectedCategory(null)}>
                            <div className="category-name">All Genres</div>
                        </li>
                        {categoryTree.map(category => (
                            <CategoryItem
                                key={category.categoryId}
                                category={category}
                                selectedCategory={selectedCategory}
                                onCategorySelect={setSelectedCategory}
                            />
                        ))}
                    </ul>
                </aside>
            </div>
        </div>
    );
}

export default ProductsPage;
