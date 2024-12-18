import React, { useState, createContext, useEffect } from 'react'
import { useAuthToken } from '../../AuthTokenContext'

export const CartContext = createContext();

const CartContextProvider = (props) => {
  const { accessToken } = useAuthToken()
  const [cart, setCart] = useState();
  const [cartId, setCartId] = useState();

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    getDefaultCart()
  }, [accessToken])

  
  const getDefaultCart = () => {
    fetch(`${process.env.REACT_APP_API_URL}/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setCart(data.cartData);
        setCartId(data.cartId);
      })
      .catch(error => {
        console.error('Error fetching cart:', error);
        alert('An error occurred while fetching cart.');
      })
  }

  const getCartCount = () => {
      if (!cart) {
        return 0;
      }
      return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  const addToCart = (productId) => {
    
    if (!cartId) {
      console.error('Cart not found');
      return;
    }
    const productData = { productId: productId };

    fetch(`${process.env.REACT_APP_API_URL}/cart/${cartId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(productData)
    }).then(response => response.json())
    .then(()=>{
      getDefaultCart()
    })
  }

  const decreaseFromCart = async (productId) => {
    if (!cartId) {
      console.error('Cart not found');
      return;
    }
    const productData = { productId: productId };

    fetch(`${process.env.REACT_APP_API_URL}/cart/${cartId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(productData)
    }).then(response => response.json())
    .then(()=>{
      getDefaultCart()
    })
  }

const removeFromCart = async (cartItemId) => {
    console.log('cartItemId', cartItemId)
    if (!cartId) {
      console.error('Cart not found');
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/cartItem/${cartItemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => response.json())
    .then(()=>{
      getDefaultCart()
    })
};


  const contextValue = { cart, getCartCount, getDefaultCart, addToCart, decreaseFromCart, removeFromCart };
  return (
    <CartContext.Provider value={contextValue}>
      {props.children}
    </CartContext.Provider>
  )
}


export default CartContextProvider;