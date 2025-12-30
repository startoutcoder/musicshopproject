import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProfileRedirect = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && user?.userId) {
            navigate(`/profile/${user.userId}`);
        } else {

            navigate('/login');
        }
    }, [user, isAuthenticated, navigate]);

    return null;
};

export default ProfileRedirect;