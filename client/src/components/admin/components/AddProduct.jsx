import { useAuthToken } from '../../../AuthTokenContext'
import { useState } from 'react'
import './AddProduct.css'

export default function AddProduct() {
    const { accessToken } = useAuthToken();

    const [products, setProducts] = useState({
        brand: "",
        name: "",
        category: "women",
        image: "",
        price: "",
        link: "",
        description: "",
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
                    description: "",
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

    return (
        <div className='addProduct'>
            <div className="admin-addproduct-itemfield">
                <div className="admin-product-title">
                    <p>Product title</p>
                    <input value={products.name} onChange={changeHanlder} type="text" name="name"
                           placeholder="Type Here"/>
                </div>
            </div>
            <div className="admin-addproduct-itemfield">
                <div className="admin-addproduct-brand">
                    <p>Product Brand</p>
                    <input value={products.brand} onChange={changeHanlder} type="text" name="brand"
                           placeholder="Type Here"/>
                </div>
            </div>
            <div className="admin-addproduct-itemfield">
                <div className="admin-addproduct-category">
                    <p>Product Category</p>
                    <select value={products.category} onChange={changeHanlder} name="category"
                            className="admin-addproduct-selector">
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                        <option value="new">New</option>
                        <option value="nsale">Sale</option>
                    </select>
                </div>
            </div>
            <div className="admin-addproduct-itemfield">
                <div className="admin-addproduct-price">
                    <p>Product Price</p>
                    <input value={products.price} onChange={changeHanlder} type="Number" name="price"
                           placeholder="CA$ "/>
                </div>
            </div>
            <div className="admin-addproduct-itemfield">
                <div className="admin-addproduct-image">
                    <p>Product Image</p>
                    <input value={products.image} onChange={changeHanlder} type="text" name="image"
                           placeholder="Type Here"/>
                </div>
            </div>
            <div className="admin-addproduct-itemfield">
                <div className="admin-addproduct-link">
                    <p>Product Link</p>
                    <input value={products.link} onChange={changeHanlder} type="text" name="link"
                           placeholder="Type Here"/>
                </div>
            </div>
            <div className="admin-addproduct-itemfield">
                <div className="admin-addproduct-description">
                    <p>Product Description</p>
                    <input value={products.description} onChange={changeHanlder} type="text" name="description"
                           placeholder="Type Here"/>
                </div>
            </div>
            <button onClick={() => {
                add_product()
            }} className="admin-addproduct-btn">ADD
            </button>
        </div>
    )
}
