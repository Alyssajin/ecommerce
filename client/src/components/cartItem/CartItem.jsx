import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import './CartItem.css'; // Import the CSS file

const CartItem = () => {
  const { cart, addToCart, decreaseFromCart, removeFromCart } = useContext(CartContext);

  if (!cart || cart.length === 0) {
      return <p className="empty-cart">Your cart is empty. <br/>Search for itemsor select a category to start shopping.</p>;
  }

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (

    <div className="cart-container">

      {/*  cart headers */}
      <div className="cart-header">
        <p className="cart-header-item">Item</p>
        <p className="cart-header-quantity">Quantity</p>
        <p className="cart-header-total">Subtotal</p>
      </div>

      {/*  cart items */}
      {cart && cart.map((item, index) => (
        <div key={index} className="cart-item">

          <div className="cart-item-details">
            <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
            <div className="cart-item-info">
              <p>{item.product.name}</p>
              <p>${item.product.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="cart-item-quantity">
            <button onClick={() => decreaseFromCart(item.product.id)}>-</button>
            <p>{item.quantity}</p>
            <button onClick={() => addToCart(item.product.id)}>+</button>
          </div>

          <div className="cart-item-total">
            <p>${(item.product.price * item.quantity).toFixed(2)}</p>
          </div>

          <div className="cart-item-remove">
            <button onClick={() => removeFromCart(item.id)}>&times;</button>
          </div>

        </div>
      ))}

      <div className="cart-summary">
        <div className="cart-summary-total">
          <p>Total</p>
          <p>${cartTotal.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
