import React from 'react'
import { useState } from 'react'
import AddProduct from './components/AddProduct'
import DisplayProduct from './components/DisplayProduct'
import './Admin.css';

const Admin = () => {
    const [activeTab, setActiveTab] = useState("display");

    return (
        <div className='admin'>
            <div className="admin-header">
                <h1>Admin Page</h1>
            </div>
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
            </div>
            <div className='admin-content'>
                {activeTab === "add" && <AddProduct />}
                {activeTab === "display" && <DisplayProduct />}
            </div>
        </div>
    )
}

export default Admin