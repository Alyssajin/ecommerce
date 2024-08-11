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
    fetch('http://localhost:8000/cart', {
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

  const addToCart = (productId) => {
    
    if (!cartId) {
      console.error('Cart not found');
      return;
    }
    const productData = { productId: productId };

    fetch(`http://localhost:8000/cart/${cartId}`, {
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

  const removeFromCart = async (productId) => {
    setCart((prevCart) => {
      return prevCart.map((item) =>
        item.product.id === productId && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter((item) => item.quantity > 0); 
    });
    
    if (!cartId) {
      console.error('Cart not found');
      return;
    }
    const productData = { productId: productId };

    fetch(`http://localhost:8000/cart/${cartId}`, {
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

  const contextValue = { cart, getDefaultCart, addToCart, removeFromCart };
  return (
    <CartContext.Provider value={contextValue}>
      {props.children}
    </CartContext.Provider>
  )
}


export default CartContextProvider;