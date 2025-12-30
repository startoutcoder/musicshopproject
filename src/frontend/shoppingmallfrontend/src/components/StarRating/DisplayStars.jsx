import React from 'react';
import './DisplayStars.css';

const DisplayStars = ({ rating }) => {
    if (rating === null || rating === undefined) return null;
    const ratingOutOfFive = rating;

    const fullStars = Math.floor(ratingOutOfFive);
    const hasHalfStar = (ratingOutOfFive - fullStars) >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="display-stars">
            {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`} className="star filled">★</span>)}
            {hasHalfStar && (
                <span className="star half">
                    <span className="star-half-filled">★</span>
                    <span className="star-half-empty">☆</span>
                </span>
            )}
            {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="star empty">☆</span>)}
        </div>
    );
};

export default DisplayStars;