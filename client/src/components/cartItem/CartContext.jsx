import React, { useState, createContext, useEffect } from 'react'
import { useAuthToken } from '../../AuthTokenContext'

export const CartContext = createContext();

const CartContextProvider = (props) => {
  const { accessToken } = useAuthToken()
  const [cart, setCart] = useState();

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    getDefaultCart()
  }, [accessToken])


  const getDefaultCart = () => {
    fetch('http://localhost:8000/cart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.cartData)
        setCart(data.cartData);


      })
      .catch(error => {
        console.error('Error fetching cart:', error);
        alert('An error occurred while fetching cart.');
      })
  }
  const addToCart = (products) => {
    const cartId = cart.cartId;
    fetch(`http://localhost:8000/cart/${cartId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(products)
    })
  }
  const contextValue = { cart, addToCart };
  return (
    <CartContext.Provider value={contextValue}>
      {props.children}
    </CartContext.Provider>
  )
}


export default CartContextProvider;