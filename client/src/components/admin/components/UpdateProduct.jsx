import React from 'react'
import { useState } from 'react'
import { useAuthToken } from '../../../AuthTokenContext'

export default function UpdateProduct() {
    const { accessToken } = useAuthToken();
    const [products, setProducts] = useState();

    const changeHanlder = (e) => {
        e.preventDefault();
        setProducts({
            ...products,
            [e.target.name]: e.target.value
        })
    }

    const updateProduct = async () => {

        let productData = products;

        await fetch(`http://localhost:8000/products`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(productData)
        })
            .then(resp => resp.json())
            .then((data) => { data.success ? alert("Product Updated") : alert("Failed") })
    }
    return (
        <div className="update-product">
            <h1>Update Product</h1>
            <div className="update-product-form">
                <label htmlFor="brand">Brand</label>
                <input type="text" name="brand" id="brand" onChange={changeHanlder} value={products.brand} />
                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name" onChange={changeHanlder} value={products.name} />
                <label htmlFor="category">Category</label>
                <select name="category" id="category" onChange={changeHanlder} value={products.category}>
                    <option value="women"> women </option>
                    <option value="men"> men</option>
                    <option value="kids"> kids </option>
                </select>
                <label htmlFor="image">Image</label>
                <input type="text" name="image" id="image" onChange={changeHanlder} value={products.image} />
                <label htmlFor="price">Price</label>
                <input type="text" name="price" id="price" onChange={changeHanlder} value={products.price} />
                <label htmlFor="link">Link</label>
                <input type="text" name="link" id="link" onChange={changeHanlder} value={products.link} />
                <button onClick={updateProduct}>Update Product</button>
            </div>
        </div>


    )
}
