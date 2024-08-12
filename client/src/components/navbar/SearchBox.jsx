import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import search_icon from "../../assets/icons/search_icon.png";
import { SearchContext } from '../../context/SearchContext';

export default function NavSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const { fetchSearchResults, error, setError } = useContext(SearchContext);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        setError(null); // Clear error when user starts typing
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchSearchResults(searchQuery, navigate);
        }
    };

    return (
        <div className="nav-search">
            <div className="nav-search-box">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDownCapture={handleKeyPress}
                />
                <img
                    src={search_icon}
                    alt="Search"
                    onClick={() => fetchSearchResults(searchQuery, navigate)}
                    style={{ cursor: 'pointer' }}
                />
            </div>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
}
