import React from 'react'
import './Hero.css'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='hero'>
        <div className="hero-img-container">
            <Link to="/sale">
              <img src="//images.ctfassets.net/q602vtcuu3w3/7wkCiB2MLoMDqX7XWLuMVE/7715ffe7a90fb8b130ba9d18e78656dd/24-PROMO-CORE-CLEARNACE-SALE-751912.jpg?w=2880&amp;q=80&amp;fm=jpg&amp;fl=progressive" 
                  alt=""
                  fetchpriority="auto">
              </img>
            </Link>
        </div>

    </div>
  )
}

export default Hero