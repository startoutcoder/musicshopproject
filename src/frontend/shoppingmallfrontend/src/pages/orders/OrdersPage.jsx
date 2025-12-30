import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import './OrdersPage.css';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/orders/my-orders');
                setOrders(response.data);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
                setError("Could not load your orders. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <p className="page-status">Loading your orders...</p>;
    if (error) return <p className="page-status error">{error}</p>;

    return (
        <div className="orders-page">
            <div className="orders-header">
                <h1>Your Orders</h1>
            </div>

            {orders.length > 0 ? (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.orderId} className="order-card">
                            <div className="order-card-header">
                                <div className="header-info">
                                    <span className="info-label">ORDER PLACED</span>
                                    <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                                </div>
                                <div className="header-info">
                                    <span className="info-label">TOTAL</span>
                                    <span>${order.totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="header-info">
                                    <span className="info-label">ORDER #</span>
                                    <span>{order.orderId}</span>
                                </div>
                            </div>
                            <div className="order-card-body">
                                {order.items.map(item => (
                                    <div key={item.productId} className="order-item">
                                        <img src={item.imageUrl} alt={item.productName} className="item-image" />
                                        <div className="item-details">
                                            <Link to={`/products/${item.productId}`} className="item-name">{item.productName}</Link>
                                            <p className="item-price">Price: ${item.priceAtPurchase.toFixed(2)}</p>
                                            <p className="item-quantity">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-orders-message">You have not placed any orders yet.</p>
            )}
        </div>
    );
}

export default OrdersPage;