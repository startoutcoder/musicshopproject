import React from 'react';
import './AverageRating.css';

const AverageRating = ({ rating, count }) => {
    if (!count || count === 0) {
        return (
            <div className="average-rating-container">
                <div className="stars-display">
                    {[...Array(5)].map((_, i) => <span key={i} className="star-display empty">☆</span>)}
                </div>
                <p className="rating-text">No ratings yet.</p>
            </div>
        );
    }

    const fullStars = Math.floor(rating);
    const hasHalfStar = (rating - fullStars) >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="average-rating-container">
            <div className="stars-display">
                {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`} className="star-display filled">★</span>)}
                {hasHalfStar && (
                    <span className="star-display half">
                        <span className="star-half-filled">★</span>
                        <span className="star-half-empty">☆</span>
                    </span>
                )}
                {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="star-display empty">☆</span>)}
            </div>
            <p className="rating-text">
                <strong>{rating.toFixed(1)}</strong> out of 5
                <span className="rating-count">({count} ratings)</span>
            </p>
        </div>
    );
};

export default AverageRating;