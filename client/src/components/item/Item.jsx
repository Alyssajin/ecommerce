import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom'

const Item = (props) => {
  return (
    <div className='item'>
        <Link to={`/shop/${props.id}`}><img onClick={window.scroll(0,0)} src={prop.image} alt=""/> </Link>
        <div className='item-brand'>
            <p>{props.brand}</p>
        </div>
        <div className='item-name'>
            <p>${props.name}</p>
        </div>
        <div className='item-price'>
            <p>${props.price}</p>
        </div>
    </div>
  )
}

export default Item