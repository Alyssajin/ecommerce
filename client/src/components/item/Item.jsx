import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom'
import { CartContext } from '../cartItem/CartContext'
import { useContext } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import PriceTag from "../priceTag/PriceTag";


const Item = (props) => {
  const {addToCart} = useContext(CartContext)
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const logIn = () => loginWithRedirect();

 
  return (
    <div className='item'>
        <Link to={`/shop/${props.id}`}>
          <div className='item-image-container'>
            <img onClick={window.scroll(0,0)} src={props.image} alt=""/>
            <div className='item-add-container'>
              { !isAuthenticated ? (
                <button className='item-add-button' onClick={logIn}>Add to Cart</button>
              ) : (
                <button className='item-add-button'onClick={()=>addToCart(props.id)}  >Add to Cart</button>
              )}
            </div>
          </div>
        </Link>

        <div className='item-brand'>
            <p>{props.brand}</p>
        </div>
        <div className='item-name'>
            {/*  should names be prefixed with '$'? */}
            <p>{props.name}</p>
        </div>
        <div className='item-price'>
            <PriceTag price={props.price} />
        </div>
    </div>
  )
}

export default Item