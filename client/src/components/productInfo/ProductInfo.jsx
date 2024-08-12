import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductInfo.css';
import { CartContext } from '../cartItem/CartContext';
import { useAuth0 } from '@auth0/auth0-react';
import PriceTag from "../priceTag/PriceTag";

const ProductInfo = () => {
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useContext(CartContext);
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const logIn = () => loginWithRedirect();

    useEffect(() => {
        const fetchProductInfo = async () => {
            try {
                const response = await fetch(`http://localhost:8000/products/${id}`);
                const data = await response.json();

                if (data.success) {
                    setProduct(data.product);
                } else {
                    setError(`Product ${id} not found`);
                }
            } catch (err) {
                console.error("Error fetching product details:", err);
                setError("An error occurred while fetching product details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProductInfo();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(parseInt(id));
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000); // Hide after 3 seconds
    };

    if (loading) {
        return <p className="product-info-page-loading">Loading...</p>;
    }

    if (error) {
        return <p className="product-info-page-error">{error}</p>;
    }

    return (
        <div className="product-info-page">
            {product ? (
                <>
                    <div className="product-info-page-title-container">
                    <h1 className="product-info-page-title">{product.name}</h1>
                    </div>
                <div className="product-info-page-item">
                    <img src={product.image} alt={product.name} className="product-info-image" />
                    <div className="product-info-details">
                        <h3>Brand</h3><p className="product-info-details-brand">{product.brand}</p>
                        <h3>Category</h3><p className="product-info-details-category">{product.category}</p>
                        <h3>Price</h3> <PriceTag price={product.price} />
                        <h3>Description</h3><p className="product-info-details-description">{product.description}</p>

                        <div className="product-info-links">
                            <a href={product.link} target="_blank" rel="noreferrer">View Source Site</a>
                            <div>
                                {!isAuthenticated ? (
                                    <button className='info-add-button' onClick={logIn}>Add to Cart</button>
                                ) : (
                                    <button className='info-add-button' onClick={handleAddToCart}>Add to Cart</button>
                                )}
                            </div>
                        </div>
                        {showSuccessMessage && (
                            <div className={`success-message ${showSuccessMessage ? 'active' : ''}`}>
                                Item successfully added to your cart!
                            </div>
                        )}
                    </div>
                </div>
                </>
            ) : (
                <p className="product-info-page-empty">No product details available.</p>
            )}
        </div>
    );
};

export default ProductInfo;
