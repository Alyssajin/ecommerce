import React from 'react'
import { useState } from 'react'
import { useAuthToken } from '../../AuthTokenContext'
import AddProduct from './components/AddProduct'
import DisplayProduct from './components/DisplayProduct'

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


    // Update a product in the database
    const update_product = async () => {

        let productData = products;

        await fetch(`http://localhost:8000/products`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        })
            .then(resp => resp.json())
            .then((data) => { data.success ? alert("Product Updated") : alert("Failed") })
    }




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
                    {action === "add" ? <AddProduct /> : null}
                    {action === "display" ? <DisplayProduct /> : null}
                </div>
            </div>
        </div>
    )
}

export default Admin