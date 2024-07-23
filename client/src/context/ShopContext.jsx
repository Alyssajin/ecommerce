import React, {createContext} from "react";

/* Change it in the future to fetch data from the server */
const all_products = [];

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const contextValue = {all_products};
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;