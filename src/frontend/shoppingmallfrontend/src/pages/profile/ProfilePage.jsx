
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { loginSuccess } from '../../redux/authSlice.js';
import api from '../../services/api';
import './ProfilePage.css';

import ProfileSidebar from "./ProfileSidebar.jsx";
import RecentRatings from "./RecentRatings.jsx";
import FavoriteAlbumCard from "./FavoriteAlbumCard.jsx";
import SetFavoriteAlbum from "./SetFavoriteAlbum.jsx";
import EditProfilePicture from "./EditProfilePicture.jsx";

function ProfilePage() {
    const { userId: profileUserId } = useParams();
    const { user: currentUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [userProfile, setUserProfile] = useState(currentUser);
    const [isFavAlbumModalOpen, setIsFavAlbumModalOpen] = useState(false);
    const [isPicModalOpen, setIsPicModalOpen] = useState(false);

    const [recentReviews, setRecentReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                if (currentUser && currentUser.userId === profileUserId) {
                    setUserProfile(currentUser);

                    const reviewsResponse = await api.get(`/api/reviews/user/${currentUser.id}`);
                    setRecentReviews(reviewsResponse.data);
                }
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchProfileData();
        } else {
            setLoading(false);
        }
    }, [profileUserId, currentUser]);

    const handleProfileUpdate = (updatedUserDTO) => {
        setUserProfile(updatedUserDTO);
        const updatedAuthPayload = {
            token: localStorage.getItem('token'),
            userDTO: updatedUserDTO,
        };
        dispatch(loginSuccess(updatedAuthPayload));
    };

    if (loading) return <p>Loading profile...</p>;
    if (!userProfile) return <p>Please log in to view your profile.</p>;

    return (
        <div className="profile-page">
            <aside className="profile-sidebar-column">
                <ProfileSidebar
                    user={userProfile}
                    onProfileUpdate={handleProfileUpdate}
                    onPictureEditClick={() => setIsPicModalOpen(true)}
                />
            </aside>

            <main className="profile-main-column">
                <section className="profile-section">
                    <h2 className="profile-section-title">Favorite Album</h2>
                    <div className="favorite-album-container">
                        {userProfile.favoriteAlbum ? (
                            <FavoriteAlbumCard album={userProfile.favoriteAlbum} />
                        ) : (
                            <button className="set-favorite-btn" onClick={() => setIsFavAlbumModalOpen(true)}>
                                Set Your Favorite Album!
                            </button>
                        )}
                    </div>
                </section>
                <section className="profile-section">
                    <RecentRatings reviews={recentReviews} />
                </section>
            </main>

            {isFavAlbumModalOpen && (
                <SetFavoriteAlbum
                    currentAlbum={userProfile.favoriteAlbum}
                    onClose={() => setIsFavAlbumModalOpen(false)}
                    onProfileUpdate={handleProfileUpdate}
                />
            )}
            {isPicModalOpen && (
                <EditProfilePicture
                    onClose={() => setIsPicModalOpen(false)}
                    onProfileUpdate={handleProfileUpdate}
                />
            )}
        </div>
    );
}

export default ProfilePage;