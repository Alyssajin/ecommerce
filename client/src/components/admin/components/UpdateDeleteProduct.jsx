import React from 'react'
import { useState, useEffect } from 'react'
import { useAuthToken } from '../../../AuthTokenContext'
import './UpdateDeleteProduct.css'


export default function UpdateProduct({product}) {
    const { accessToken } = useAuthToken();
    const [products, setProducts] = useState({product});

    useEffect(() => {
        setProducts({
            ...product,
            price: product.price ? `CA$ ${product.price}` : '',
        });
    }, [product]);

    const changeHanlder = (e) => {
        e.preventDefault();
        setProducts({
            ...products,
            [e.target.name]: e.target.value
        })
    }

    const updateProduct = async () => {

        // let productData = products;

        await fetch(`http://localhost:8000/products/${product.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(products)
        })
            .then(resp => resp.json())
            .then((data) => { data.success ? alert("Product Updated") : alert("Failed") })
            .catch((error) => {
                console.error("Error updating product:", error);
                alert("An error occurred while updating the product.");
            });
    }

    const deleteProduct = async () => {
        await fetch(`http://localhost:8000/products/${product.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
        })
            .then(resp => resp.json())
            .then((data) => { data.success ? alert("Product Deleted") : alert("Failed") })
            .catch((error) => {
                console.error("Error deleting product:", error);
                alert("An error occurred while deleting the product.");
            });
    }
    
    return (
        <div className="update-product">
            <h1>Update Product</h1>
            <div className="update-product-form">
                <label htmlFor="brand">Brand</label>
                <input type="text" name="brand" className="brand" onChange={changeHanlder} value={products.brand || ''} />
                <label htmlFor="name">Name</label>
                <input type="text" name="name" className="name" onChange={changeHanlder} value={products.name || ''} />
                <label htmlFor="category">Category</label>
                <select name="category" className="category" onChange={changeHanlder} value={products.category || ''}>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kids">Kids</option>
                </select>
                <label htmlFor="image">Image</label>
                <input type="text" name="image" className="image" onChange={changeHanlder} value={products.image || ''} />
                <label htmlFor="price">Price</label>
                <input type="text" name="price" className="price" onChange={changeHanlder} value={products.price || ''} />
                <label htmlFor="link">Link</label>
                <input type="text" name="link" className="link" onChange={changeHanlder} value={products.link || ''} />
                <button onClick={updateProduct}>Update Product</button>
                <button onClick={deleteProduct}>Delete Product</button>
            </div>
        </div>
    );
}
