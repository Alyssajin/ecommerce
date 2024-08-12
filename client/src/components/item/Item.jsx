import React, { useState, useContext } from 'react';
import './Item.css';
import { Link } from 'react-router-dom';
import { CartContext } from '../cartItem/CartContext';
import { useAuth0 } from '@auth0/auth0-react';
import PriceTag from "../priceTag/PriceTag";

const Item = (props) => {
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [added, setAdded] = useState(false);

  const logIn = () => loginWithRedirect();

  const handleAddToCart = (e, id) => {
    e.preventDefault(); // Prevent the default behavior
    addToCart(id);
    setAdded(true);

    setTimeout(() => setAdded(false), 3000); // hide the message after 3 seconds
  };

  return (
    <div className='item'>
      <div className='item-image-container'>
        <Link to={`/shop/${props.id}`}>
          <img  src={props.image} alt="" />
        </Link>
        <div className='item-add-container'>
          {!isAuthenticated ? (
            <button
              className='item-add-button'
              onClick={(e) => { e.preventDefault(); logIn(); }}
            >
              Add to Cart
            </button>
          ) : (
            <button
              className='item-add-button'
              onClick={(e) => handleAddToCart(e, props.id)}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

      <div className='item-brand'>
        <p>{props.brand}</p>
      </div>
      <div className='item-name'>
        <p>{props.name}</p>
      </div>
      <div className='item-price'>
        <PriceTag price={props.price} />
      </div>

      <div className={`item-success-message ${added ? 'show' : ''}`}>
        Item successfully added to cart!
      </div>
    </div>
  );
}

export default Item;
