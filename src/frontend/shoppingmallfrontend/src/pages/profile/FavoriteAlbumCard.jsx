import React from 'react';
import { Link } from 'react-router-dom';
import './FavoriteAlbumCard.css';

const FavoriteAlbumCard = ({ album }) => {
    if (!album) return null;

    return (
        <Link to={`/products/${album.productId}`} className="fav-album-card">
            <img src={album.imageUrl} alt={album.productName} className="fav-album-image" />
            <div className="fav-album-info">
                <p className="fav-album-name">{album.productName}</p>
                <p className="fav-album-artist">{album.artistName}</p>
                <p className="fav-album-genre">{album.productCategory?.categoryName}</p>
            </div>
        </Link>
    );
};

export default FavoriteAlbumCard;
