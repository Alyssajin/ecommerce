import React, { useState, useEffect } from 'react';
import { useAuthToken } from '../../../AuthTokenContext';
import './DisplayProduct.css';
import UpdateDeleteProduct from './UpdateDeleteProduct';
import Pagination from '../../pagination/Pagination';

export default function DisplayProduct() {
    const itemsPerPage = 6;
    const { accessToken } = useAuthToken();

    const [requirement, setRequirement] = useState("all");
    const [brandName, setBrandName] = useState("");
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [id, setId] = useState("");
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
                    // Response is a list of products
                    setProduct(data.products);
                    setTotalPages(Math.ceil(data.products.length / itemsPerPage));
                } else if (data.product) {
                    // Response is a single product
                    setProduct([data.product]); // Wrap the single product in an array
                    setTotalPages(1); // Only one page since it's a single product
                } else {
                    // No products returned
                    setProduct([]);
                    setTotalPages(1);
                }
            } else {
                alert("Failed to fetch products");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            alert("An error occurred while fetching products.");
        }
    };

    const displayAllProducts = async () => {
        await fetchData(`http://localhost:8000/products`);
    };

    const displayProductByBrand = async () => {
        const encodedBrandName = encodeURIComponent(brandName);
        await fetchData(`http://localhost:8000/products/brand/${encodedBrandName}`);
    };

    const displayProductByName = async () => {
        const encodedName = encodeURIComponent(name);
        await fetchData(`http://localhost:8000/products/name/${encodedName}`);
    };

    const displayProductByCategory = async () => {
        const encodedCategory = encodeURIComponent(category);
        await fetchData(`http://localhost:8000/products/category/${encodedCategory}`);
    };

    const displayProductById = async () => {
        const encodedId = encodeURIComponent(id);
        await fetchData(`http://localhost:8000/products/${encodedId}`);
    };

    const handleDisplay = () => {
        setCurrentPage(1); // Reset to the first page on new query
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
                {requirement === "brand" && <input value={brandName} type="text" placeholder="Enter Brand Name" onChange={(e) => setBrandName(e.target.value)} />}
                {requirement === "name" && <input value={name} type="text" placeholder="Enter Product Name" onChange={(e) => setName(e.target.value)} />}
                {requirement === "category" && <input value={category} type="text" placeholder="Enter Category" onChange={(e) => setCategory(e.target.value)} />}
                {requirement === "id" && <input value={id} type="text" placeholder="Enter Product Id" onChange={(e) => setId(e.target.value)} />}
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
                                <p><span className="field-name">Link:</span> <a href={product.link} target="_blank" rel="noreferrer">Click to see source</a></p>
                            </div>
                            <img src={product.image} alt={product.name}/>
                        </div>
                        <UpdateDeleteProduct product={product}/>
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
