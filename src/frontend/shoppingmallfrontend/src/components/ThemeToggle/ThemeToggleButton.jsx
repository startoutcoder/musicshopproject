import React from 'react';
import { useTheme} from "../../context/ThemeContext.jsx";
import { FaSun, FaMoon } from 'react-icons/fa';
import './ThemeToggleButton.css'

const ThemeToggleButton = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <label htmlFor="theme-switch-toggle" className = "theme-switch">
            <input
                id = "theme-switch-toggle"
                type = "checkbox"
                onChange = {toggleTheme}
                checked = {theme === 'dark'}
                />
            <span className = "theme-switch-slider">
                <FaSun className = "slider-icon-sun-icon"/>
                <FaMoon className = "slider-icon-moon-icon"/>
            </span>
        </label>
    );
};

export default ThemeToggleButton;