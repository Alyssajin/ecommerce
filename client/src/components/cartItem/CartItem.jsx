import React, {useContext} from 'react'
import { CartContext } from './CartContext'


const CartItem = () => {
  const { cart } = useContext(CartContext)
  return (
    <div className="cartItems">
      {cart.map(item => (
        <div key={item.id} className="cartItem">
          <img src={item.image} alt={item.name} />
          <div className="cartItemDetails">
            <h3>{item.name}</h3>
            <p>Price: ${item.price}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CartItem;