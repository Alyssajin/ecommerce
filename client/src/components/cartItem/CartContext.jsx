import React, { useState, createContext, useEffect } from 'react'
import { useAuthToken } from '../../AuthTokenContext'

export const CartContext = createContext();

const CartContextProvider = (props) => {
  const { accessToken } = useAuthToken()
  const [cart, setCart] = useState([]);

  useEffect(() => {
    console.log('accessToken:', accessToken)
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
        setCart(data.cart);

      })
      .catch(error => {
        console.error('Error fetching cart:', error);
        alert('An error occurred while fetching cart.');
      })
  }

  // const addToCart = (productId, quantity) => {
  //   fetch('http://localhost:8000/cartItem', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${accessToken}`
  //     },
  //     body: JSON.stringify({
  //       productId,
  //       quantity
  //     })
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log(data)
  //       setCart(data.cart)
  //     })
  //     .catch(error => {
  //       console.error('Error adding to cart:', error)
  //       alert('An error occurred while adding to cart.')
  //     })
  // }
  const contextValue = { cart };
  return (
    <CartContext.Provider value={contextValue}>
      {props.children}
    </CartContext.Provider>
  )
}


export default CartContextProvider;