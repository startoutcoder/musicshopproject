import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate, Link} from "react-router-dom";
import {loginSuccess} from "../redux/authSlice.js";
import AuthService from "../services/authService.js";
import './LoginPage.css'

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await AuthService.login({email, password});
            dispatch(loginSuccess(data));
            navigate('/');
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            console.error(err);
        }
    };

    return (
        <div className = 'login-page-wrapper'>
            <div className = 'login-form-container'>
                <h2 className = "login-title">Sign in</h2>
                <form onSubmit={handleLogin} className = 'login-form'>
                    <div className = 'input-group'>
                        <label htmlFor ="email">Email address</label>
                        <input type="email"
                               id = "email"
                               value = {email}
                               onChange = {(e) => setEmail(e.target.value)}
                               required
                               />
                    </div>
                    <div className = "input-group">
                        <label htmlFor= "password">Password</label>
                        <input type = "password"
                               id = "password"
                               value = {password}
                               onChange = {(e) => setPassword(e.target.value)}
                               required
                               />
                    </div>
                    {error && <p className = "error-message"> {error}</p>}
                    <button type = "submit" className = "signin-button">
                        Sign In
                    </button>
                </form>
                <div className= "login-helpers">
                    <a href = "#" className = "help-link">Help, I can't sign in</a>
                    <p>Don't have an account? <Link to = "/register" className = "help-link">Create one.</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;