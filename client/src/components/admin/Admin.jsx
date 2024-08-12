import React, { useEffect, useState } from 'react'
import AddProduct from './components/AddProduct'
import DisplayProduct from './components/DisplayProduct'
import UploadAllProducts from './components/UploadAllProducts'
import './Admin.css'
import AuthDebugger from "../authDebugger/AuthDebugger";

const Admin = () => {
    const [activeTab, setActiveTab] = useState("display");


    useEffect(() => {
        if (activeTab === "display") {
            const displayProductComponent = document.querySelector('.display-products-context');
            if (displayProductComponent && displayProductComponent.firstChild) {
                // products already displayed, no need to call handleDisplay
            } else {
                document.querySelector('.display-options button').click();
            }
        }
    }, [activeTab]);

    return (
        <div className='admin'>
            {/* changed the buttons to tabs*/}
            <div className="admin-tabs">
                <div
                    className={`tab ${activeTab === "add" ? "active" : ""}`}
                    onClick={() => setActiveTab("add")}
                >
                    Add Product
                </div>
                <div
                    className={`tab ${activeTab === "display" ? "active" : ""}`}
                    onClick={() => setActiveTab("display")}
                >
                    Display Products
                </div>
                <div
                    className={`tab ${activeTab === "upload" ? "active" : ""}`}
                    onClick={() => setActiveTab("upload")}
                >
                    Upload All Products
                </div>
                <div
                    className={`tab ${activeTab === "auth" ? "active" : ""}`}
                    onClick={() => setActiveTab("auth")}
                >
                    Check Current Auth
                </div>
            </div>
            <div className='admin-content'>
                {activeTab === "add" && <AddProduct />}
                {activeTab === "display" && <DisplayProduct />}
                {activeTab === "upload" && <UploadAllProducts />}
                {activeTab === "auth" && <AuthDebugger />}
            </div>
        </div>
    )
}

export default Admin