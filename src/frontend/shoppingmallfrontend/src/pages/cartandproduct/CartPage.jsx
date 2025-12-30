import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart, removeFromCart } from '../../redux/cartSlice.js';
import './CartPage.css';

function CartPage() {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const totalPrice = useSelector((state) => state.cart.totalPrice);

    return (
        <div className="cart-page">
            <h1 className="cart-title">Your Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className="cart-empty">
                    <p>Your cart is currently empty.</p>
                    <Link to="/products" className="continue-shopping-btn">Continue Shopping</Link>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items-list">
                        {cartItems.map(item => (
                            <div key={item.product.productId} className="cart-item">
                                <img src={item.product.imageUrl} alt={item.product.productName} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <h3 className="item-name">{item.product.productName}</h3>
                                    <p className="item-price">${item.product.productPrice.toFixed(2)}</p>
                                </div>
                                <div className="cart-item-actions">
                                    <button onClick={() => dispatch(removeFromCart(item.product.productId))}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => dispatch(addToCart(item.product))}>+</button>
                                </div>
                                <div className="cart-item-total">
                                    ${item.totalPrice.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h2 className="summary-title">Order Summary</h2>
                        <div className="summary-details">
                            <span>Subtotal</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;