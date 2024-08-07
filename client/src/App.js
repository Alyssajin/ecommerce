import React, { createContext, useContext } from 'react'
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




export const DataContext = createContext(null)



function App() {
    function RequireAuth({ children }) {
        const { isAuthenticated, isLoading } = useAuth0();
        if (!isAuthenticated && !isLoading) {
            return <Navigate to="/" replace/>
        }
        return children
    }

    return (
        <div>
            <BrowserRouter>
                <Banner />
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/women" element={<ShopCategory title="Women's Clothing" category="women" />} />
                    <Route path="/verify-user" element={<VerifyUser />} />
                    <Route path="profile" element={<Profile />} />
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
                </Routes>
                <Footer />
            </BrowserRouter>

        </div>
    );
}

export default App;