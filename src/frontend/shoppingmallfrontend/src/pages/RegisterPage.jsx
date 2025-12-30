import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/authService';
import './LoginPage.css';

import { useDispatch } from 'react-redux';
import { registrationSuccess } from '../redux/authSlice.js';

function RegisterPage () {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        userId : '',
        email : '',
        confirmEmail :'',
        password : '',
        confirmPassword : '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name] : e.target.value});
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Your validation checks are good
        if (formData.email !== formData.confirmEmail) {
            setError("The email addresses do not match.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("The passwords do not match.");
            return;
        }

        try {
            const userData = {
                userId: formData.userId,
                userName: formData.userId,
                email: formData.email,
                password: formData.password,
            };

            const responseData = await AuthService.register(userData);

            console.log('Backend Registration Response:', responseData);

            dispatch(registrationSuccess(responseData));

            setSuccess('Registration Successful! Redirecting...');
            setTimeout (() => {
                navigate('/');
            }, 2000);

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'The user ID or email may be taken.';
            setError(`Registration failed: ${errorMessage}`);
            console.error(err);
        }
    };
    return (
        <div className="login-page-wrapper">
            <div className="login-form-container">
                <h2 className="login-title">Create Account</h2>

                <form onSubmit={handleRegister} className="login-form">
                    <div className="input-group">
                        <label htmlFor="userId">USER ID</label>
                        <input type="text" id="userId" name="userId" value={formData.userId} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">EMAIL ADDRESS</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmEmail">CONFIRM EMAIL</label>
                        <input type="email" id="confirmEmail" name="confirmEmail" value={formData.confirmEmail} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">PASSWORD</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}

                    <button type="submit" className="signin-button">
                        Sign Up
                    </button>
                </form>

                <div className="login-helpers">
                    <p>
                        Already have an account? <Link to="/login" className="help-link">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;