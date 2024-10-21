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
        <div className="flex flex-col md:flex-row items-center">
            <div className="flex items-center border border-gray-300 rounded-md p-2">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDownCapture={handleKeyPress}
                    className="flex-grow p-2 outline-none"
                />
                <img
                    src={search_icon}
                    alt="Search"
                    onClick={() => fetchSearchResults(searchQuery, navigate)}
                    className="cursor-pointer w-6 h-6 ml-2"
                />
            </div>
            {error && <div className="text-red-500 mt-2 md:mt-0 md:ml-4">{error}</div>}
        </div>
    );
}
