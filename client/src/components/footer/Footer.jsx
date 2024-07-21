import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <div className='footer'>
        <div className="footer-email-signup">
            <div className="footer-email-signup-left">
                <p className="footer-email-signup-title">Sign Up for Email and Get 15% off Your First Purchase</p>
                <p className="footer-email-signup-text">Sign up to receive Urban Outfitters emails and get first dibs on new arrivals, sales, exclusive content, events and more!</p>
            </div>
            <div className="footer-email-signup-middle">
            </div>
            <div className="footer-email-signup-right">
                <label htmlFor="email-signup">Email Address</label>
                <div className="footer-email-signup-form">
                    <input type="email" id="email-signup" name="email-signup" placeholder="" />
                    <button>Submit</button>
                </div>
            </div>
        </div>
        <div className="footer-disclaimer">
            <p>By entering your email address, you agree to receive Urban Outfitters offers, promotions, other commercial messages. You can view our Privacy Policy here and you may unsubscribe at any time.</p>
        </div>
        <hr />
        <div className="footer-social">
            <a className="footer-social-apple" href="http://itunes.apple.com/us/app/uo/id358821736?mt=8">
                <img src="//images.ctfassets.net/q602vtcuu3w3/6dBQRtUvXacKeuqywuQgCs/a6cbaf8d4b86a8e99548694b7074bf04/UO_UI-WEB_SOCIAL-FOOTER_APP_APPLE-ICON.svg" 
                    alt="" 
                    fetchpriority="auto">
                </img>
            </a>
            <a className="footer-social-google" href="https://play.google.com/store/apps/details?id=com.urbanoutfitters.android">
                <img src="//images.ctfassets.net/q602vtcuu3w3/2mEsc8ts7uIasMuKaeEGoW/ff456fdecc547481f27ac3528d9a6300/UO_UI-WEB_SOCIAL-FOOTER_APP_GOOGLE-ICON.svg" 
                    alt="" 
                    fetchpriority="auto">
                </img>
            </a>
        </div>
        <div className="footer-legal">
            <p>© 2024 Urban Outfitters All Rights Reserved</p>

        </div>
    </div>
  )
}

export default Footer;