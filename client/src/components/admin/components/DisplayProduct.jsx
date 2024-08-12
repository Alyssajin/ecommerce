import React, { useState, useEffect } from 'react';
import { useAuthToken } from '../../../AuthTokenContext';
import './DisplayProduct.css';
import UpdateDeleteProduct from './UpdateDeleteProduct';
import Pagination from '../../pagination/Pagination';

export default function DisplayProduct() {
    const itemsPerPage = 6;
    const { accessToken } = useAuthToken();

    const [requirement, setRequirement] = useState("all");
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");
    const [product, setProduct] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        displayAllProducts();
    }, []);

    const fetchData = async (url) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
            });

            const data = await response.json();

            if (data.success) {
                if (Array.isArray(data.products)) {
                    setProduct(data.products);
                    setTotalPages(Math.ceil(data.products.length / itemsPerPage));
                } else if (data.product) {
                    setProduct([data.product]);
                    setTotalPages(1);
                } else {
                    setProduct([]);
                    setTotalPages(1);
                }
            } else if (response.status === 401) {
                alert("Unauthorized access. Please log in.");
            } else if (response.status === 404) {
                setProduct([]);
                setTotalPages(1);
            } else {
                alert("An error occurred while fetching products.");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            alert("Connection not successful.");
        }
    };

    const displayAllProducts = async () => {
        await fetchData(`http://localhost:8000/products`);
    };

    const displayProductByRequirement = async () => {
        const encodedValue = encodeURIComponent(inputValue);
        let url = `http://localhost:8000/products`;

        switch (requirement) {
            case "brand":
                url = `http://localhost:8000/products/brand/${encodedValue}`;
                break;
            case "name":
                url = `http://localhost:8000/products/name/${encodedValue}`;
                break;
            case "category":
                url = `http://localhost:8000/products/category/${encodedValue}`;
                break;
            case "id":
                url = `http://localhost:8000/products/${encodedValue}`;
                break;
            default:
                displayAllProducts();
                return;
        }
        await fetchData(url);
    };

    const handleDisplay = () => {
        if (requirement !== "all" && inputValue.trim() === "") {
            setError(`${requirement.charAt(0).toUpperCase() + requirement.slice(1)} is required.`);
            return;
        }

        setError(""); // Clear error message if input is valid
        setCurrentPage(1); // Reset to the first page on new query
        displayProductByRequirement();
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setError("");
    };

    // Get current products
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = product.slice(indexOfFirstProduct, indexOfLastProduct);

    const onPageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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
                {requirement !== "all" && (
                    <div>
                        <input
                            value={inputValue}
                            type="text"
                            placeholder={`Enter ${requirement.charAt(0).toUpperCase() + requirement.slice(1)}`}
                            onChange={handleInputChange}
                        />
                        {error && <div className="error-message">{error}</div>}
                    </div>
                )}
                <button onClick={handleDisplay}>Display</button>
            </div>

            <div className='display-products-context'>
                {currentProducts.length > 0 ? currentProducts.map((product) => (
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
                        <div className="product-actions">
                            <UpdateDeleteProduct product={product}/>
                        </div>
                    </div>
                )) : <p>No products to display</p>}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}
