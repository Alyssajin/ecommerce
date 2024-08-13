import React from 'react'
import './Popular.css'
import { Link } from 'react-router-dom'

const Popular = () => {
  return (
    <div className='popular'>
        <div className="popular-container">
            <div className="popular-content-container">
                
                <div className="popular-inner-top">
                    <Link to="/women">
                        <img src="//images.ctfassets.net/q602vtcuu3w3/7FN9jV5pR4KceNjErZ4DKw/c33bcf73d1bafe5b373ee0487389a916/24_JULY_HOMEPAGE_ASSETS_EM64__1_.jpg?w=1420&amp;q=80&amp;fm=jpg&amp;fl=progressive" 
                            alt="women" 
                            fetchpriority="auto">
                        </img>
                    </Link>
                </div>
                <div className="popular-inner-middle">
                    <p className="inner-text-title">
                        NEW TREND
                    </p>
                    <p className="inner-text-subtitle">
                        Women Collection
                    </p>
                </div>
                <div className="popular-inner-bottom">
                    <div className="popular-inner-link">
                        <a href='/women' className="inner-btm-text">
                            SHOP WOMEN
                        </a>
                    </div>
                </div>
            </div>

            <div className="popular-content-container">
                <div className="popular-inner-top">
                    <Link to="/men">
                        <img src="//images.ctfassets.net/q602vtcuu3w3/2phu60i1EqhFkzbnyuboAr/027f792503dbff07722cafbfeaa61c7a/24_JULY_HOMEPAGE_ASSETS_EM12.jpg?w=1420&amp;q=80&amp;fm=jpg&amp;fl=progressive" 
                            alt="men" 
                            fetchpriority="auto">
                        </img>
                    </Link>
                </div>
                <div className="popular-inner-middle">
                    <p className="inner-text-title">
                        NEW TREND
                    </p>
                    <p className="inner-text-subtitle">
                        Men Collection
                    </p>
                </div>
                <div className="popular-inner-bottom">
                    <div className="popular-inner-link">
                        <a href='/men' className="inner-btm-text">
                            SHOP MEN
                        </a>
                    </div>
                </div>
            </div>
            <div className="popular-content-container">
                <div className="popular-inner-top">
                    <Link to="/kids">
                        <img src="//images.ctfassets.net/q602vtcuu3w3/3z0wxYTVPgyzgxgYpMfK6B/50db539dac40c49f5d562c5a8b40cfdb/24_JULY_HOMEPAGE_ASSETS_EM2__1_.jpg?w=710&amp;q=80&amp;fm=jpg&amp;fl=progressive" 
                            alt="kids" 
                            fetchpriority="auto">
                        </img>
                    </Link>
                </div>
                <div className="popular-inner-middle">
                    <p className="inner-text-title">
                        NEW TREND
                    </p>
                    <p className="inner-text-subtitle">
                        Kids Collection
                    </p>
                </div>
                <div className="popular-inner-bottom">
                    <div className="popular-inner-link">
                        <a href='/kids' className="inner-btm-text">
                            SHOP KIDS
                        </a>
                    </div>
                </div>
            </div>
            <div className="popular-content-container">
                <div className="popular-inner-top">
                    <Link to="/sale">
                        <img src="//images.ctfassets.net/q602vtcuu3w3/4kKJY3JU476F1SvHpjRfyv/30a58cc854fbbf4b2e7f61697667fed3/24_JULY_HOMEPAGE_ASSETS_EM59.jpg?w=1420&amp;q=80&amp;fm=jpg&amp;fl=progressive" 
                            alt="sale" 
                            fetchpriority="auto">
                        </img>
                    </Link>
                </div>
                <div className="popular-inner-middle">
                    <p className="inner-text-title">
                        NEW TREND
                    </p>
                    <p className="inner-text-subtitle">
                        Sale Collection
                    </p>
                </div>
                <div className="popular-inner-bottom">
                    <div className="popular-inner-link">
                        <a href='/sale' className="inner-btm-text">
                            SHOP SALE
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Popular