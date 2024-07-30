import React, { createContext, useContext } from 'react'
import './App.css'
import { Navbar } from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/Home";
import VerifyUser from "./components/VerifyUser";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Banner from './components/banner/Banner';
import ShopCategory from './pages/ShopCategory';

export const DataContext = createContext(null)



function App() {

    return (
        <div>
            <BrowserRouter>
                <Banner />
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/women" element={<ShopCategory category="women" />} />
                    <Route path="/verify-user" element={<VerifyUser />} />
                </Routes>
                <Footer />
            </BrowserRouter>

        </div>
    );
}

export default App;