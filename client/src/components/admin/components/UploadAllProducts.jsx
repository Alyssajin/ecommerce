import React, { useState } from 'react';
import { useAuthToken } from '../../../AuthTokenContext';
import './AddProduct.css';

export default function UploadAllProducts() {
    const { accessToken } = useAuthToken();
    const [product, setProduct] = useState({});
    const [fileData, setFileData] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                setFileData(json);
            } catch (error) {
                console.error("Error parsing JSON file:", error);
            }
        };

        if (file) {
            reader.readAsText(file);
        }
    };

    const uploadAllProducts = async (data) => {
        if (!data) {
            alert("No data to upload.");
            return;
        }

        for (let i = 0; i < data.length; i++) {
            const productData = data[i];
            try {
                const response = await fetch(`http://localhost:8000/products`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(productData),
                });

                await response.json();
            } catch (error) {
                console.error("Error uploading product:", error);
            }
        }
        alert("All products uploaded successfully");
    };

    const handleUpload = (event) => {
        event.preventDefault(); // Prevent form submission
        uploadAllProducts(fileData);
    };

    return (
        <div className='uploadAllProducts'>
            <form onSubmit={handleUpload}>
                <input type="file" name="file" id="file" accept=".json" onChange={handleFileChange} />
                <button type="submit">Upload All Products</button>
            </form>
        </div>
    );
}
