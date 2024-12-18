import React, { useState } from 'react';
import { useAuthToken } from '../../../AuthTokenContext';
import './AddProduct.css';
import './UploadAllProducts.css';

export default function UploadAllProducts() {
    const { accessToken } = useAuthToken();
    const [fileData, setFileData] = useState(null);
    const [fileName, setFileName] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        if (file) {
            setFileName(file.name);
        }

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
                const response = await fetch(`${process.env.REACT_APP_API_URL}/products`, {
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
                alert("An error occurred while uploading products.");
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
                <label>
                    <input type="file" name="file" id="file" accept=".json" onChange={handleFileChange}/>
                    <span className="file-label-text">
                        {fileData ? `Selected file: ${fileName}` : "Click to upload or drag & drop JSON file here\nRecommend uploading `client/src/assests/products.json` file"}
                    </span>
                </label>
                <button type="submit">Upload All Products</button>
            </form>
        </div>
    );
}
