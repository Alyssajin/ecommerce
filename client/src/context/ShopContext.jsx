import React, { createContext, useEffect, useState } from 'react'
export const ShopContext = createContext()


const ShopContextProvider = (props) => {
    const [all_products, setAllProducts] = useState([])
    useEffect(() => {
        // fetch data from server
        fetch(`${process.env.REACT_APP_API_URL}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then((data) => {
            setAllProducts(data.products);
        })
        .catch((error) => {
            console.error("Error fetching products:", error);
        });
    }, []);


    const contextValue = {all_products}

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider