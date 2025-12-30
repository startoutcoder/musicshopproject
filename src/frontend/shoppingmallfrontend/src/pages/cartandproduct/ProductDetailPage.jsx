import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../services/api';
import { addToCart } from '../../redux/cartSlice';
import StarRating from '../../components/StarRating/StarRating';
import Tracklist from '../../components/Tracklist/Tracklist';
import AverageRating from "../../components/StarRating/AverageRating.jsx";
import DisplayStars from "../../components/StarRating/DisplayStars.jsx";
import './ProductDetailPage.css';

function ProductDetailPage() {
    const { productId } = useParams();
    const { isAuthenticated, user: currentUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tracks, setTracks] = useState([]);

    const [newReview, setNewReview] = useState({ title: '', comment: '', rating: 0 });
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editedContent, setEditedContent] = useState({ title: '', comment: '', rating: 0 });

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const [productResponse, reviewsResponse, tracksResponse] = await Promise.all([
                    api.get(`/api/products/${productId}`),
                    api.get(`/api/reviews/product/${productId}`),
                    api.get(`/api/tracks/product/${productId}`)
                ]);
                setProduct(productResponse.data);
                setReviews(reviewsResponse.data);
                setTracks(tracksResponse.data);
            } catch (err) {
                setError("Could not load product details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [productId]);

    const handleNewReviewInputChange = (e) => setNewReview({ ...newReview, [e.target.name]: e.target.value });
    const handleNewRatingChange = (rating) => setNewReview({ ...newReview, rating });
    const handleNewReviewSubmit = async (e) => {
        e.preventDefault();
        if (newReview.rating === 0) {
            alert("Please select a rating.");
            return;
        }
        try {
            const response = await api.post('/api/reviews', { ...newReview, productId });
            setReviews([response.data, ...reviews]);
            setNewReview({ title: '', comment: '', rating: 0 });
        } catch (error) {
            console.error("Failed to submit review:", error);
            alert("Could not submit review. You may need to be logged in.");
        }
    };

    const handleEditInputChange = (e) => setEditedContent({ ...editedContent, [e.target.name]: e.target.value });
    const handleEditRatingChange = (rating) => setEditedContent({ ...editedContent, rating });

    const startEditing = (review) => {
        setEditingReviewId(review.id);
        setEditedContent({ title: review.title, comment: review.comment, rating: review.rating });
    };

    const cancelEditing = () => setEditingReviewId(null);

    const handleUpdateReview = async (e) => {
        e.preventDefault();
        try {
            const updatePayload = {
                ...editedContent,
                productId: Number(productId) // Ensure it's a number
            };

            const response = await api.put(`/api/reviews/${editingReviewId}`, updatePayload);
            setReviews(reviews.map(r => r.id === editingReviewId ? response.data : r));
            setEditingReviewId(null);
        } catch (error) {
            console.error("Failed to update review:", error);
            alert("Could not update review.");
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                await api.delete(`/api/reviews/${reviewId}`);
                setReviews(reviews.filter(r => r.id !== reviewId));
            } catch (error) {
                console.error("Failed to delete review:", error);
                alert("Could not delete review.");
            }
        }
    };

    const handleAddToCart = () => {
        if (product) dispatch(addToCart(product));
    };

    if (loading) return <p className="page-status">Loading Product...</p>;
    if (error) return <p className="page-status error">{error}</p>;
    if (!product) return <p className="page-status">Product not found.</p>;

    return (
        <div className="product-detail-page">
            <div className="product-main-content">
                <div className="product-detail-image-container">
                    <img src={product.imageUrl} alt={product.productName} className="product-detail-image" />
                </div>
                <div className="product-detail-info">
                    <h2 className="detail-artist-name">{product.artistName}</h2>
                    <h1 className="detail-product-name">{product.productName}</h1>
                    <p className="detail-category-name">{product.productCategory.categoryName}</p>
                    <p className="detail-product-price">${product.productPrice.toFixed(2)}</p>
                    <AverageRating rating={product.averageRating} count={product.ratingCount} />
                    <p className="detail-product-description">
                        This is a placeholder for a more detailed album description.
                    </p>
                    <button className="add-to-cart-btn detail-page-btn" onClick={handleAddToCart}>
                        Add to Cart
                    </button>
                </div>
            </div>

            <div className="tracklist-section">
                <Tracklist tracks={tracks} />
            </div>

            <div className="review-section">
                <h2>Reviews & Ratings</h2>
                {isAuthenticated && editingReviewId === null && (
                    <form onSubmit={handleNewReviewSubmit} className="review-form">
                        <h3>Leave a Review</h3>
                        <input type="text" name="title" placeholder="Review Title" value={newReview.title} onChange={handleNewReviewInputChange} required />
                        <textarea name="comment" placeholder="Your comments..." value={newReview.comment} onChange={handleNewReviewInputChange}></textarea>
                        <div className="rating-submit">
                            <StarRating rating={newReview.rating} onRatingChange={handleNewRatingChange} />
                            <button type="submit">Submit Review</button>
                        </div>
                    </form>
                )}
                {!isAuthenticated && (
                    <div className="login-prompt">
                        <Link to="/login">Log in</Link> to leave a review.
                    </div>
                )}

                <div className="reviews-list">
                    {reviews.map(review => (
                        <div key={review.id} className="review-item">
                            {editingReviewId === review.id ? (
                                <form onSubmit={handleUpdateReview} className="review-edit-form">
                                    <input
                                        type="text"
                                        name="title"
                                        value={editedContent.title}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                    <textarea
                                        name="comment"
                                        value={editedContent.comment}
                                        onChange={handleEditInputChange}
                                    ></textarea>
                                    <div className="edit-actions">
                                        <StarRating
                                            rating={editedContent.rating}
                                            onRatingChange={handleEditRatingChange}
                                        />
                                        <div className = "edit-action-buttons">
                                            <button type="button" onClick={cancelEditing} className="cancel-btn">Cancel</button>
                                            <button type="submit" className="save-btn">Save</button>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="review-header">
                                        <h4>{review.title}</h4>
                                        {currentUser?.id === review.authorId && (
                                            <div className="review-actions">
                                                <button onClick={() => startEditing(review)}>Edit</button>
                                                <button onClick={() => handleDeleteReview(review.id)} className="delete-btn">Delete</button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="review-rating-display">
                                        <DisplayStars rating={review.rating} />
                                        <span className="rating-number-text">{review.rating.toFixed(1)} / 5.0</span>
                                    </div>
                                    <p className="review-comment">{review.comment}</p>
                                    <p className="review-meta">by <Link to={`/profile/${review.authorUserId}`} className="author-link">{review.authorName}</Link> on {new Date(review.createdAt).toLocaleDateString()}</p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;
