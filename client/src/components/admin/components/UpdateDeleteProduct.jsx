import React from 'react'
import { useState, useEffect } from 'react'
import { useAuthToken } from '../../../AuthTokenContext'
import './UpdateDeleteProduct.css'


export default function UpdateProduct({product}) {
    const { accessToken } = useAuthToken();
    const [products, setProducts] = useState({ product });
    const [showUpdateModal, setShowUpdateModal] = useState(false);

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
        await fetch(`http://localhost:8000/products/${product.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(products)
        })
            .then(resp => resp.json())
            .then((data) => {
                if (data.success) {
                    alert("Product Updated");
                    setShowUpdateModal(false); // close modal after successful update
                } else {
                    alert("Failed to update product");
                }
            })
            .catch((error) => {
                console.error("Error updating product:", error);
                alert("An error occurred while updating the product.");
            });
    };

    const deleteProduct = async () => {
        await fetch(`http://localhost:8000/products/${product.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
        })
            .then(resp => resp.json())
            .then((data) => {
                data.success ? alert("Product Deleted") : alert("Failed to delete product");
            })
            .catch((error) => {
                console.error("Error deleting product:", error);
                alert("An error occurred while deleting the product.");
            });
    };

    const openUpdateModal = () => {
        setShowUpdateModal(true);
    };

    const closeUpdateModal = () => {
        setShowUpdateModal(false);
    };

    return (
        <div>
            <div className="action-buttons">
                <button onClick={openUpdateModal}>Update</button>
                <button onClick={deleteProduct}>Delete</button>
            </div>

            {showUpdateModal && (
                <div className="update-modal">
                    <div className="update-modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="update-modal-close" onClick={closeUpdateModal}>&times;</span>
                        <h1>Update Product</h1>
                        <div className="update-product-form">
                            <div className="form-item">
                                <label htmlFor="brand">Brand</label>
                                <input type="text" name="brand" className="brand" onChange={changeHanlder}
                                       value={products.brand || ''}/>
                            </div>
                            <div className="form-item">
                                <label htmlFor="name">Name</label>
                                <input type="text" name="name" className="name" onChange={changeHanlder}
                                       value={products.name || ''}/>
                            </div>
                            <div className="form-item">
                                <label htmlFor="category">Category</label>
                                <select name="category" className="category" onChange={changeHanlder}
                                        value={products.category || ''}>
                                    <option value="women">Women</option>
                                    <option value="men">Men</option>
                                    <option value="kids">Kids</option>
                                </select>
                            </div>
                            <div className="form-item">
                                <label htmlFor="image">Image</label>
                                <input type="text" name="image" className="image" onChange={changeHanlder}
                                       value={products.image || ''}/>
                            </div>
                            <div className="form-item">
                                <label htmlFor="price">Price</label>
                                <input type="text" name="price" className="price" onChange={changeHanlder}
                                       value={products.price || ''}/>
                            </div>
                            <div className="form-item">
                                <label htmlFor="link">Link</label>
                                <input type="text" name="link" className="link" onChange={changeHanlder}
                                       value={products.link || ''}/>
                            </div>
                        </div>
                        <button onClick={updateProduct}>Confirm</button>
                    </div>
                </div>
            )}
        </div>
    );
}
