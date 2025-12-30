import React, { useState } from 'react';
import './StarRating.css';

const StarRating = ({ rating, onRatingChange }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="star-rating-input">
            {[1, 2, 3, 4, 5].map((starIndex) => {
                const leftHalfValue = starIndex - 0.5;
                const rightHalfValue = starIndex;

                return (
                    <div
                        key={starIndex}
                        className="star-wrapper"
                        onMouseLeave={() => setHoverRating(0)}
                    >
                        <div
                            className="star-half left"
                            onMouseEnter={() => setHoverRating(leftHalfValue)}
                            onClick={() => onRatingChange(leftHalfValue)}
                        />
                        <div
                            className="star-half right"
                            onMouseEnter={() => setHoverRating(rightHalfValue)}
                            onClick={() => onRatingChange(rightHalfValue)}
                        />

                        <svg className="star-svg" viewBox="0 0 24 24">
                            <path className="star-background" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            <defs>
                                <clipPath id={`clip-${starIndex}`}>
                                    <rect x="0" y="0" width={`${((hoverRating || rating) - (starIndex - 1)) * 100}%`} height="24" />
                                </clipPath>
                            </defs>
                            <path className="star-foreground" clipPath={`url(#clip-${starIndex})`} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    </div>
                );
            })}
        </div>
    );
};

export default StarRating;