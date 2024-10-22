import React, { createContext, useEffect } from 'react'
import './App.css'
import { Navbar } from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/Home";
import VerifyUser from "./components/VerifyUser";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Banner from './components/banner/Banner';
import ShopCategory from './pages/ShopCategory';
import AppLayout from './components/appLayout/AppLayout';
import Profile from './components/profile/Profile';
import AuthDebugger from './components/authDebugger/AuthDebugger';
import { useAuth0 } from '@auth0/auth0-react';
import Admin from './components/admin/Admin';
import CartItem from './components/cartItem/CartItem';
import ProductInfo from "./components/productInfo/ProductInfo";




export const DataContext = createContext(null)



function App() {

    function RequireAuth({ children }) {
        const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

        useEffect(() => {
            if (!isAuthenticated && !isLoading) {
                loginWithRedirect();
            }
        }, [isAuthenticated, isLoading, loginWithRedirect]);

        if (isLoading || !isAuthenticated) {
            return null;
        }

        return children;
    }

    return (
        <div>
            <BrowserRouter>
                <Banner />
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="new" element={<ShopCategory title="New Arrivals" category="new" />} />
                    <Route path="women" element={<ShopCategory title="Women's Clothing" category="women" />} />
                    <Route path="men" element={<ShopCategory title="Men's Clothing" category="men" />} />
                    <Route path="sale" element={<ShopCategory title="Sale Items" category="sale" />} />
                    <Route path="verify-user" element={<VerifyUser />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="search" element={<ShopCategory title="Search Results" category="search" />} />
                    <Route path="shop/:id" element={<ProductInfo />} />

                    {/* admin app */}
                    <Route path="app" element={
                        <RequireAuth>
                            <AppLayout />
                        </RequireAuth>
                    }
                    >
                        <Route index element={<Profile />} />
                        <Route path="debugger" element={<AuthDebugger />} />
                        <Route path="admin" element={<Admin />} />
                    </Route>
                    <Route path="/cart" element={
                        <RequireAuth>
                            <CartItem />
                        </RequireAuth>
                    } />
                </Routes>
                <Footer />
            </BrowserRouter>

        </div>
    );
}

export default App;