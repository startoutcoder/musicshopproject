import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import api from '../../services/api.js';
import { clearCart } from '../../redux/cartSlice.js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from "./CheckoutForm.jsx";
import './CheckoutPage.css';

const stripePromise = loadStripe('pk_test_51RiAKvQeW3qtIptBdFjJIxM3hw2XxIx1MVChwR9RJy592xyTbgOFNLc1DfTOTht3I6nQesWinHOvahLRiAufmvKE00BVI0FGgY');

function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector(state => state.cart.items);
    const totalPrice = useSelector(state => state.cart.totalPrice);
    const user = useSelector(state => state.auth.user);

    const [step, setStep] = useState('shipping');
    const [clientSecret, setClientSecret] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [shippingDetails, setShippingDetails] = useState({
        shippingAddress: user?.shippingAddress || '',
        billingAddress: user?.billingAddress || '',
        phoneNumber: user?.phoneNumber || '',
    });
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
    };

    const handleProceedToPayment = async (e) => {
        e.preventDefault();
        if (!shippingDetails.shippingAddress || !shippingDetails.billingAddress || !shippingDetails.phoneNumber) {
            setError("Please fill in all address and phone number fields.");
            return;
        }
        setError('');
        setIsProcessing(true);

        try {
            // THE FIX: Send the cart items in the request body so the backend can calculate the price.
            const response = await api.post('/api/payment/create-payment-intent', {
                items: cartItems.map(item => ({
                    productId: item.product.productId,
                    quantity: item.quantity
                }))
            });
            setClientSecret(response.data.clientSecret);
            setStep('payment');
        } catch (err) {
            console.error("Could not initialize payment", err);
            setError("Could not initialize payment. Please try again later.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePlaceOrder = async () => {
        const orderData = {
            orderItems: cartItems.map(item => ({
                productId: item.product.productId,
                quantity: item.quantity,
            })),
            ...shippingDetails,
        };
        try {
            const response = await api.post('/api/orders', orderData);
            dispatch(clearCart());
            navigate(`/order-confirmation/${response.data.orderId}`);
        } catch (err) {
            console.error("Failed to place order:", err);
            setError('There was a critical error placing your order. Please contact support.');
        }
    };

    const appearance = { theme: 'stripe' };
    const options = { clientSecret, appearance };

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <div className="order-summary">
                    <h2>Your Order</h2>
                    {cartItems.map(item => (
                        <div key={item.product.productId} className="summary-item">
                            <span>{item.product.productName} x {item.quantity}</span>
                            <span>${item.totalPrice.toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="summary-total">
                        <strong>Total</strong>
                        <strong>${totalPrice.toFixed(2)}</strong>
                    </div>
                </div>
                <div className="shipping-details">
                    {step === 'shipping' ? (
                        <>
                            <h2>Shipping Details</h2>
                            <form onSubmit={handleProceedToPayment}>
                                <div className="form-group">
                                    <label htmlFor="shippingAddress">Shipping Address</label>
                                    <input type="text" id="shippingAddress" name="shippingAddress" value={shippingDetails.shippingAddress} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="billingAddress">Billing Address</label>
                                    <input type="text" id="billingAddress" name="billingAddress" value={shippingDetails.billingAddress} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phoneNumber">Phone Number</label>
                                    <input type="tel" id="phoneNumber" name="phoneNumber" value={shippingDetails.phoneNumber} onChange={handleInputChange} required />
                                </div>
                                {error && <p className="error-message">{error}</p>}
                                <button type="submit" className="place-order-btn" disabled={isProcessing}>
                                    {isProcessing ? 'Initializing...' : 'Proceed to Payment'}
                                </button>
                            </form>
                        </>
                    ) : (
                        clientSecret && (
                            <Elements options={options} stripe={stripePromise}>
                                <CheckoutForm onPaymentSuccess={handlePlaceOrder} />
                            </Elements>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
