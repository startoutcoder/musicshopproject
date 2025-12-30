import React from 'react';
import { Link } from 'react-router-dom';
import './RecentRatings.css';

const RecentRatings = ({ reviews }) => {
    return (
        <div className="recent-ratings">
            <h2 className="profile-section-title">Recent Ratings</h2>
            {reviews.length > 0 ? (
                <ul className="ratings-list">
                    {reviews.map(review => (
                        <li key={review.id} className="rating-item">
                            <Link to={`/products/${review.product.productId}`}>
                                <img src={review.product.imageUrl} alt={review.product.productName} className="rating-album-art" />
                            </Link>
                            <div className="rating-details">
                                <Link to={`/products/${review.product.productId}`} className="rating-product-link">
                                    {review.product.productName}
                                </Link>
                                <p className="rating-title">{review.title}</p>
                                <p className="rating-comment">{review.comment}</p>
                            </div>
                            <div className="rating-score">
                                {review.rating}/10
                                <span className="star-icon">★</span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-ratings-message">No recent ratings to display.</p>
            )}
        </div>
    );
};

export default RecentRatings;
