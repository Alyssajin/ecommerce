import React from 'react'
import { useState } from 'react'
import AddProduct from './components/AddProduct'
import DisplayProduct from './components/DisplayProduct'

const Admin = () => {

    const [action, setAction] = useState("display");


    return (
        <div className='admin'>
            <div className="admin-header">
                <h1>Admin Page</h1>
            </div>
            <div className="admin-content">
                <div className="admin-options">
                    <button onClick={() => setAction("add")}>Add Product</button>
                    <button onClick={() => setAction("display")}>Display Products</button>
                </div>
                <div className='admin-action'>
                    {action === "add" ? 
                    <AddProduct /> : action === "display" ? 
                    <DisplayProduct /> : null}
                </div>
            </div>
        </div>
    )
}

export default Admin