import React from 'react'
import { useState } from 'react'
import { useAuthToken } from '../../AuthTokenContext'
import AddProduct from './components/AddProduct'
import DisplayProduct from './components/DisplayProduct'
import UpdateProduct from './components/UpdateProduct'

const Admin = () => {
    const { accessToken } = useAuthToken();
    const [products, setProducts] = useState({
        brand: "",
        name: "",
        category: "women",
        image: "",
        price: "",
        link: "",
    })

    const changeHanlder = (e) => {
        e.preventDefault();
        setProducts({
            ...products,
            [e.target.name]: e.target.value
        })
    }

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
                    <button onClick={() => setAction("update")}>Update Product</button>
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