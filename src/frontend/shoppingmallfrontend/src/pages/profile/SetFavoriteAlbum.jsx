import React, { useState, useEffect } from 'react';
import useDebounce from '../../hooks/useDebounce';
import api from '../../services/api';
import './SetFavoriteAlbum.css';

const SetFavoriteAlbum = ({ currentAlbum, onClose, onProfileUpdate }) => {
    const [searchTerm, setSearchTerm] = useState(currentAlbum?.productName || '');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(currentAlbum || null);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        if (debouncedSearchTerm && debouncedSearchTerm !== selectedAlbum?.productName) {
            api.get(`/api/products/search?query=${debouncedSearchTerm}`)
                .then(response => setSearchResults(response.data));
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchTerm, selectedAlbum]);

    const handleSelectAlbum = (album) => {
        setSearchTerm(album.productName);
        setSelectedAlbum(album);
        setSearchResults([]);
    };

    const handleSaveChanges = async () => {
        const profileData = { favoriteAlbumId: selectedAlbum?.productId || null };
        try {
            const response = await api.put('/api/users/profile', profileData);
            onProfileUpdate(response.data);
            onClose();
        } catch (error) {
            console.error("Failed to update favorite album", error);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Set Favorite Album</h2>
                <div className="form-group">
                    <label htmlFor="favoriteAlbum">Search for an album</label>
                    <input
                        type="text"
                        id="favoriteAlbum"
                        placeholder="Start typing..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoComplete="off"
                    />
                    {searchResults.length > 0 && (
                        <ul className="search-results">
                            {searchResults.map(album => (
                                <li key={album.productId} onClick={() => handleSelectAlbum(album)}>
                                    {album.productName} by {album.artistName}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="modal-actions">
                    <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                    <button type="button" onClick={handleSaveChanges} className="save-btn">Set as Favorite</button>
                </div>
            </div>
        </div>
    );
};

export default SetFavoriteAlbum;
