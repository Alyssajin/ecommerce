import React, {useState, useContext, useRef, useEffect} from "react"
import cart_icon from "../../assets/icons/cart.png"
// import "./Navbar.css"
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
        <div className='flex flex-col justify-around p-4 items-center border-b border-gray-400 w-full box-border'>
            {/*removed the horizontal line*/}
            <div className="sticky top-0 bg-white w-full z-100">
                <div className="flex flex-row items-center justify-between mt-2 ml-12 w-full h-12">
                    <div className="s:w-360 s:m-5">
                        <a href="/">
                            <picture>
                                <source media="(min-width: 1025px)" />
                                <img src="https://images.ctfassets.net/q602vtcuu3w3/5Kn3hosoikXHaQhOx4GikS/a97e3757c14fb0539d553c0a0462f4c7/URBAN-OUTFITTERS_LOGO_2022.svg" alt="Urban Outfitters" />
                            </picture>
                        </a>
                    </div>
                    <div className="flex flex-row w-auto justify-between items-center gap-20 mr-16 box-border">
                        <NavSearch />
                        <div className="flex flex-row items-end cursor-pointer">
                            <Link to="/cart">
                                <img src={cart_icon} alt="Cart" className="h-9" />
                            </Link>
                            <div className="w-5 h-5 text-sm flex justify-center items-center mb-5 -ml-6 rounded-full bg-black text-white">{cartCount}</div> {/* Updated to display cart count */}
                        </div>

                    </div>
                </div>
                <hr className="w-full mt-4 ml-0 border-0 border-t border-gray-400"></hr>
                <ul ref={menuRef} className="text-black flex items-center list-none gap-12 text-base font-medium w-full mt-5 ml-2 h-12">
                    {/* Change the hr line to the  */}
                    <li onClick={() => { setMenu("new") }}><Link style={{ textDecoration: "none" }} to="/new"><span className="text-black cursor-pointer">New</span></Link>{menu === "new" ? <hr className="nav-menu-hr" /> : <></>}</li>
                    <li onClick={() => { setMenu("women") }}><Link style={{ textDecoration: "none" }} to="/women"><span className="text-black cursor-pointer">Women</span></Link>{menu === "women" ? <hr className="nav-menu-hr" /> : <></>}</li>
                    <li onClick={() => { setMenu("men") }}><Link style={{ textDecoration: "none" }} to="/men"><span className="text-black cursor-pointer">Men</span></Link>{menu === "men" ? <hr className="nav-menu-hr" /> : <></>}</li>
                    <li onClick={() => { setMenu("sale") }}><Link style={{ textDecoration: "none" }} to="/sale"><span className="text-red-600 cursor-pointer">Sale</span></Link>{menu === "sale" ? <hr className="nav-menu-hr" /> : <></>}</li>
                    {accessToken && (
                      <li onClick={() => { setMenu("admin") }}><Link style={{ textDecoration: "none" }} to="/app/admin"><span className="text-red-600 cursor-pointer">Admin Mode</span></Link>{menu === "admin" ? <hr className="nav-menu-hr" /> : <></>}</li>
                    )}
                </ul>
            {/*removed the horizontal line*/}
            </div>

        </div>
    )
}
