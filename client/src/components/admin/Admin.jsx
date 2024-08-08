import React from 'react'
import { useState } from 'react'
import { useAuthToken } from '../../AuthTokenContext'

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

    const add_product = async () => {
        let productData = {
            ...products,
            price: `CA$ ${products.price}`,
        }
        
        if (!products.brand || !products.name || !products.price) {
            alert("Brand, Name, and Price are required");
            return;
        }
        try {
            const response = await fetch(`http://localhost:8000/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(productData)
            });

            const data = await response.json();
            if (data.success) {
                alert("Product Added");
                setProducts({
                    brand: "",
                    name: "",
                    category: "women",
                    image: "",
                    price: "",
                    link: "",
                });
            } else {
                console.log(data.success);
                alert("Failed to add product");
            }
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product");
        }
    };

    const update_product = async () => {
        console.log(products)
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

    const display_product = async () => {
        try {
            const response = await fetch(`http://localhost:8000/products`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
            });
    
            const data = await response.json();
    
            if (data.success) {
                console.log("Products fetched successfully:", data.products);
            } else {
                console.log(data.success);
                alert("Failed to fetch products");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            alert("An error occurred while fetching products.");
        }
    };


    return (
        <div className='admin'>
            <div className="admin-header">
                <h1>Admin Page</h1>
            </div>
            <div className="admin-addproduct-itemfield">
                <div className="admin-product-title">
                    <p>Product title</p>
                    <input value={products.name} onChange={changeHanlder} type="text" name="name" placeholder="Type Here" />
                </div>
            </div>
            <div className="admin-addproduct-itemfield">
                <div className="admin-addproduct-brand">
                    <p>Product Brand</p>
                    <input value={products.brand} onChange={changeHanlder} type="text" name="brand" placeholder="Type Here" />
                </div>
            </div>
            <div className="admin-addproduct-itemfield">
                <div className="admin-addproduct-category">
                    <p>Product Category</p>
                    <select value={products.category} onChange={changeHanlder} name="category" className="admin-addproduct-selector">
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                        <option value="kids">Kids</option>
                    </select>
                </div>
            </div>
            <div className="admin-addproduct-itemfield">
                <div className="admin-addproduct-price">
                    <p>Product Price</p>
                    <input value={products.price} onChange={changeHanlder} type="Number" name="price" placeholder="CA$ " />
                </div>
            </div>
            <div className="admin-addproduct-itemfield">
                <div className="admin-addproduct-image">
                    <p>Product Image</p>
                    <input value={products.image} onChange={changeHanlder} type="text" name="image" placeholder="Type Here" />
                </div>
            </div>
            <div className="admin-addproduct-itemfield">
                <div className="admin-addproduct-link">
                    <p>Product Link</p>
                    <input value={products.link} onChange={changeHanlder} type="text" name="link" placeholder="Type Here" />
                </div>
            </div>
            <button onClick={() => {add_product()}} className="admin-addproduct-btn">ADD</button>
            <button onClick={() => {display_product()}} className="admin-addproduct-btn">GET</button>
        </div>
    )
}

export default Admin