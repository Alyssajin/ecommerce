import React, { useState, useEffect } from 'react'
import { useAuthToken } from '../../../AuthTokenContext'
import './UpdateDeleteProduct.css'


export default function UpdateProduct({product}) {
    const { accessToken } = useAuthToken();
    const [products, setProducts] = useState({ product });
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'auto';
    }, []);

    useEffect(() => {
        setProducts({
            ...product,
            price: product.price ? `CA$ ${product.price}` : '',
        });
    }, [product]);

    const changeHandler = (e) => {
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
                    // refresh the products list
                    document.querySelector('.display-options button').click();
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
        const confirmDelete = window.confirm(`Are you sure you want to delete "${product.name}?"`);
        if (!confirmDelete) {
            return; // Exit the function if the user cancels the deletion
        }

        await fetch(`http://localhost:8000/products/${product.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
        })
            .then(resp => resp.json())
            .then((data) => {
                if (data.success) {
                    alert("Product Deleted");
                    document.querySelector('.display-options button').click();
                } else {
                    alert("Failed to delete product");
                }
            })
            .catch((error) => {
                console.error("Error deleting product:", error);
                alert("An error occurred while deleting the product.");
            });
    };

    const openUpdateModal = () => {
        setShowUpdateModal(true);
        document.body.style.overflow = 'hidden'; // Disable background scrolling
    };

    const closeUpdateModal = () => {
        setShowUpdateModal(false);
        document.body.style.overflow = 'auto'; // Re-enable background scroll
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
                                <input type="text" name="brand" className="brand" onChange={changeHandler}
                                       value={products.brand || ''}/>
                            </div>
                            <div className="form-item">
                                <label htmlFor="name">Name</label>
                                <input type="text" name="name" className="name" onChange={changeHandler}
                                       value={products.name || ''}/>
                            </div>
                            <div className="form-item">
                                <label htmlFor="category">Category</label>
                                <select name="category" className="category" onChange={changeHandler}
                                        value={products.category || ''}>
                                    <option value="women">Women</option>
                                    <option value="men">Men</option>
                                    <option value="kids">Kids</option>
                                </select>
                            </div>
                            <div className="form-item">
                                <label htmlFor="image">Image</label>
                                <input type="text" name="image" className="image" onChange={changeHandler}
                                       value={products.image || ''}/>
                            </div>
                            <div className="form-item">
                                <label htmlFor="price">Price</label>
                                <input type="text" name="price" className="price" onChange={changeHandler}
                                       value={products.price || ''}/>
                            </div>
                            <div className="form-item">
                                <label htmlFor="link">Link</label>
                                <input type="text" name="link" className="link" onChange={changeHandler}
                                       value={products.link || ''}/>
                            </div>
                            <div className="form-item">
                                <label htmlFor="description">Description</label>
                                <input type="text" name="description" className="description" onChange={changeHandler}
                                       value={products.description || ''}/>
                            </div>
                        </div>
                        <button onClick={updateProduct}>Confirm</button>
                    </div>
                </div>
            )}
        </div>
    );
}
