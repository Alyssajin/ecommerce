import React, {useContext, useEffect} from 'react'
import { CartContext } from './CartContext'


const CartItem = () => {
  const { cart, getDefaultCart, addToCart, removeFromCart } = useContext(CartContext)

  return (
    <div className="cartItems">
      <div className="cartItems-format-main">
        <p>Products</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      {cart && cart.map((item, index) => (
        <div key={index} className="cartItem">
          <div className="cartItemDetails">
            <div>{item.product.name}</div>
            <div>{item.product.price}</div>
            <div>{item.quantity}</div>
          </div>
          <div className="cartItemActions">
            <button>+</button>
            <button onClick={()=>removeFromCart(item.product.id)}>-</button>
          </div>
        </div>
      ))}
      <div className="cartItems-down">
        <div className="cartItems-total">
          <p>Total</p>
          <div>
            <div className="cartItems-total-item">
              <p>Subtotal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem;