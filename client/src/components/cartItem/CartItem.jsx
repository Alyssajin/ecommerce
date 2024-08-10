import React, {useContext} from 'react'
import { CartContext } from './CartContext'


const CartItem = () => {
  const { cart } = useContext(CartContext)
  return (
    <div className="cartItems">
      {cart && cart.map((item, index) => (
        <div key={index} className="cartItem">
          <div className="cartItemDetails">
            <div>{item.productName}</div>
            <div>{item.price}</div>
            <div>{item.quantity}</div>
          </div>
          <div className="cartItemActions">
            <button>+</button>
            <button>-</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CartItem;