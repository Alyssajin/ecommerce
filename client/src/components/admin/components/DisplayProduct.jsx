import React from 'react'
import { useAuthToken } from '../../../AuthTokenContext'
import { useState } from 'react'
import './DisplayProduct.css'
import UpdateDeleteProduct from './UpdateDeleteProduct'


export default function DisplayProduct() {
    const { accessToken } = useAuthToken();

    const [requirement, setRequirement] = useState("all");
    const [brandName, setBrandName] = useState("");
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [id, setId] = useState("");
    const [product, setProduct] = useState();


    const displayAllProducts = async () => {
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
                // console.log("Products fetched successfully:", data.products);
                setProduct(data.products);
                console.log(product);

            } else {
                console.log(data.success);
                alert("Failed to fetch products");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            alert("An error occurred while fetching products.");
        }
    };

    const displayProductByBrand = async () => {

        try {
            const encodedBrandName = encodeURIComponent(brandName);
            const response = await fetch(`http://localhost:8000/products/brand/${encodedBrandName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },

            });

            const data = await response.json();

            if (data.success) {
                setProduct(data.products);
                console.log(product);

            } else {
                console.log(data.success);
                alert("Failed to fetch products");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            alert("An error occurred while fetching products.");
        }
    }

    const displayProductByName = async () => {

        try {
            const encodedName = encodeURIComponent(name);
            const response = await fetch(`http://localhost:8000/products/name/${encodedName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },

            });

            const data = await response.json();
            if (data.success) {
                setProduct(data.products);
                console.log(product);

                if (data.products.length === 0) {
                    alert("No products found with the given name");
                }
            } else {
                console.log(data.success);
                alert("Failed to fetch products");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            alert("An error occurred while fetching products.");
        }
    }

    const displayProductByCategory = async () => {

        try {
            const encodedCategory = encodeURIComponent(category);
            const response = await fetch(`http://localhost:8000/products/category/${encodedCategory}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },

            });

            const data = await response.json();

            if (data.success) {
                setProduct(data.products);
                console.log(product);

                if (data.products.length === 0) {
                    alert("No products found with the given category");
                }
            } else {
                console.log(data.success);
                alert("Failed to fetch products");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            alert("An error occurred while fetching products.");
        }
    }

    const displayProductById = async () => {

        try {
            const encodedId = encodeURIComponent(id);
            const response = await fetch(`http://localhost:8000/products/${encodedId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },

            });

            const data = await response.json();

            if (data.success) {
                console.log("Products fetched successfully:", data.product);
                setProduct([data.product]);
            } else {
                console.log(data.success);
                alert("Failed to fetch products");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            alert("An error occurred while fetching products.");
        }
    }
    const handleDisplay = () => {
        switch (requirement) {
            case "brand":
                displayProductByBrand();
                break;
            case "name":
                displayProductByName();
                break;
            case "category":
                displayProductByCategory();
                break;
            case "id":
                displayProductById();
                break;
            default:
                displayAllProducts();
        }
    };


    return (
        <div className='displayProduct'>
            <div className='display-options'>
                <span> Filter By: </span>
                <select onChange={(e) => setRequirement(e.target.value)}>
                    <option value="all">All Products</option>
                    <option value="brand">By Brand</option>
                    <option value="name">By Name</option>
                    <option value="category">By Category</option>
                    <option value="id">By Id</option>

                </select>
                {requirement === "brand" ? <input value={brandName} type="text" placeholder="Enter Brand Name" onChange={(e) => setBrandName(e.target.value)} /> : null}
                {requirement === "name" ? <input value={name} type="text" placeholder="Enter Product Name" onChange={(e) => setName(e.target.value)} /> : null}
                {requirement === "category" ? <input value={category} type="text" placeholder="Enter Category" onChange={(e) => setCategory(e.target.value)} /> : null}
                {requirement === "id" ? <input value={id} type="text" placeholder="Enter Product Id" onChange={(e) => setId(e.target.value)} /> : null}
                <button onClick={handleDisplay}>Display</button>
            </div>
            <div className='display-products-context'>
                {product && product.map((product) => (
                    <div key={product.id} className="product-item">
                        <h2>{product.name}</h2>
                        <div className="product-info">
                            <div className="product-info-text">
                                <p><span className="field-name">Brand:</span> {product.brand}</p>
                                <p><span className="field-name">Category:</span> {product.category}</p>
                                <p><span className="field-name">Price:</span> {product.price}</p>
                                <p><span className="field-name">Id:</span> {product.id}</p>
                                <p><span className="field-name">Link:</span> <a href={product.link} target="_blank"
                                                                                rel="noreferrer">Click to see source</a>
                                </p>
                            </div>
                            <img src={product.image} alt={product.name}/>
                        </div>
                        <UpdateDeleteProduct product={product}/>
                    </div>
                ))}

            </div>
        </div>
    )
}
