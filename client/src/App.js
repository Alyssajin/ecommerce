import React from 'react'
import './App.css'
import {Navbar} from "./components/navbar/Navbar";
import Home from "./pages/Home";
import VerifyUser from "./components/VerifyUser";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <div>
            <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/verify-user" element={<VerifyUser />} />
            </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;