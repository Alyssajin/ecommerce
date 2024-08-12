import React, {useState, useContext, useRef, useEffect} from "react"
import cart_icon from "../../assets/icons/cart.png"
import "./Navbar.css"
import { Link } from "react-router-dom"
import { CartContext } from "../cartItem/CartContext"
import { useAuthToken } from '../../AuthTokenContext'
import NavSearch from "./SearchBox";


export const Navbar = () => {
    const { accessToken } = useAuthToken()
    const [menu, setMenu] = useState("home");
    const [cartCount, setCartCount] = useState(0);
    const menuRef = useRef();
    const { cart, getCartCount, getDefaultCart } = useContext(CartContext); // Destructure the needed functions from CartContext

      useEffect(() => {
        if (!accessToken) {
          return;
        }
        getDefaultCart();
      }, [accessToken]);

      useEffect(() => {
        setCartCount(getCartCount()); // Update cart count whenever cart state changes
      }, [cart]);

    return (
        <div className='navbar'>
            {/*removed the horizontal line*/}
            <div className="nav-header">
                <div className="nav-logo">
                    <div className="nav-logo-icon">
                        <a href="/">
                            <picture>
                                <source media="(min-width: 1025px)" />
                                <img src="https://images.ctfassets.net/q602vtcuu3w3/5Kn3hosoikXHaQhOx4GikS/a97e3757c14fb0539d553c0a0462f4c7/URBAN-OUTFITTERS_LOGO_2022.svg" alt="Urban Outfitters" />
                            </picture>
                        </a>
                    </div>
                    <div className="nav-search-cart">
                        <NavSearch />
                        <div className="nav-cart">
                            <Link to="/cart">
                                <img src={cart_icon} alt="" />
                            </Link>
                            <div className="nav-cart-count">{cartCount}</div> {/* Updated to display cart count */}
                        </div>

                    </div>
                </div>
                <hr className="nav-hr"></hr>
                <ul ref={menuRef} className="nav-menu">
                    <li onClick={() => { setMenu("new") }}><Link style={{ textDecoration: "none" }} to="/new"><span className="nav-span">New</span></Link>{menu === "new" ? <hr className="nav-menu-hr" /> : <></>}</li>
                    <li onClick={() => { setMenu("women") }}><Link style={{ textDecoration: "none" }} to="/women"><span className="nav-span">Women</span></Link>{menu === "women" ? <hr className="nav-menu-hr" /> : <></>}</li>
                    <li onClick={() => { setMenu("men") }}><Link style={{ textDecoration: "none" }} to="/men"><span className="nav-span">Men</span></Link>{menu === "men" ? <hr className="nav-menu-hr" /> : <></>}</li>
                    <li onClick={() => { setMenu("kids") }}><Link style={{ textDecoration: "none" }} to="/kids"><span className="nav-span">Kids</span></Link>{menu === "kids" ? <hr className="nav-menu-hr" /> : <></>}</li>
                    <li onClick={() => { setMenu("sale") }}><Link style={{ textDecoration: "none" }} to="/sale"><span className="nav-span-special">Sale</span></Link>{menu === "sale" ? <hr className="nav-menu-hr" /> : <></>}</li>
                    <li onClick={() => { setMenu("admin") }}><Link style={{ textDecoration: "none" }} to="/app/admin"><span className="nav-span-special">Admin Mode</span></Link>{menu === "admin" ? <hr className="nav-menu-hr" /> : <></>}</li>
                </ul>
            {/*removed the horizontal line*/}
            </div>

        </div>
    )
}
