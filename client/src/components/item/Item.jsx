import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom'

const Item = (props) => {

  return (
    <div className='item'>
        <Link to={`/shop/${props.id}`}>
          <div className='item-image-container'>
            <img onClick={window.scroll(0,0)} src={props.image} alt=""/>
            <div className='item-add-container'>
              <button className='item-add-button'>Add to Cart</button>
            </div>
          </div>
        </Link>

        <div className='item-brand'>
            <p>{props.brand}</p>
        </div>
        <div className='item-name'>
            {/*  should names be prefixed with '$'? */}
            <p>${props.name}</p>
        </div>
        <div className='item-price'>
            <p>${props.price}</p>
        </div>
    </div>
  )
}

export default Item