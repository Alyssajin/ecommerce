import React, { createContext, useEffect, useState } from 'react';

export const SearchContext = createContext();

const SearchContextProvider = (props) => {
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);

    const fetchSearchResults = async (searchQuery, navigate) => {
        if (searchQuery.trim() === "") {
            setError("Please enter a search query.");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/search?query=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();

            if (data.success) {
                setSearchResults(data.products);
                navigate(`/search?query=${encodeURIComponent(searchQuery)}`, { state: { products: data.products } });
            } else {
                setSearchResults([]);
                setError("No products found.");
                navigate(`/search`, { state: { products: [] } });
            }
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to fetch products.");
        }
    };

    const contextValue = {
        searchResults,
        fetchSearchResults,
        error,
        setError,
    };

    return (
        <SearchContext.Provider value={contextValue}>
            {props.children}
        </SearchContext.Provider>
    );
};

export default SearchContextProvider;
