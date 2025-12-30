import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../redux/cartSlice';
import './ProductCard.css';

// The CardStars component does not need to be changed.
const CardStars = ({ rating }) => {
    if (rating === null || rating === undefined) return null;

    const fullStars = Math.floor(rating);
    const hasHalfStar = (rating - fullStars) >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="card-stars">
            {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`} className="star filled">★</span>)}
            {hasHalfStar && (
                <span className="star half">
                    <span className="star-half-filled">★</span>
                    <span className="star-half-empty">★</span>
                </span>
            )}
            {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="star empty">☆</span>)}
        </div>
    );
};

function ProductCard({ product }) {
    const dispatch = useDispatch();

    if (!product) return null;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart(product));
    };

    const formattedPrice = `$${Number(product.productPrice).toFixed(2)}`;

    return (
        <Link to={`/products/${product.productId}`} className="product-card-link">
            <div className='product-card'>
                <div className="product-image-container">
                    <img src={product.imageUrl} alt={product.productName} className="product-image"/>
                </div>
                <div className="product-info">
                    <h3 className="product-name">{product.productName}</h3>
                    <p className="artist-name">{product.artistName}</p>
                    <div className="card-rating-summary">
                        {product.ratingCount > 0 ? (
                            <>
                                <CardStars rating={product.averageRating} />
                                <span className="rating-count">({product.ratingCount})</span>
                            </>
                        ) : (
                            <>
                                <div className="card-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={`default-star-${i}`} className="star empty">☆</span>
                                    ))}
                                </div>
                                <span className="rating-count">(0)</span>
                            </>
                        )}
                    </div>

                    <p className="product-price">{formattedPrice}</p>
                </div>
                <button className='add-to-cart-btn' onClick={handleAddToCart}>
                    Add to Cart
                </button>
            </div>
        </Link>
    );
}

export default ProductCard;