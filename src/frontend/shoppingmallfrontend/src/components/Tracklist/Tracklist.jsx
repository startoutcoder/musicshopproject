import React, { useState } from 'react';
import './Tracklist.css';

const Tracklist = ({ tracks }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!tracks || tracks.length === 0) {
        return null;
    }

    return (
        <div className="tracklist-container">
            <button className="tracklist-toggle" onClick={() => setIsOpen(!isOpen)}>
                <span>Tracklist</span>
                <span className={`arrow ${isOpen ? 'open' : ''}`}>›</span>
            </button>
            {isOpen && (
                <ol className="tracklist">
                    {tracks.sort((a, b) => a.trackNumber - b.trackNumber).map(track => (
                        <li key={track.trackNumber} className="track-item">
                            <span className="track-number">{track.trackNumber}.</span>
                            <span className="track-title">{track.trackName}</span>
                            <span className="track-duration">{track.duration}</span>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
};

export default Tracklist;