import React from 'react'

const Admin = () => {
  return (
    <div className='admin'>
        <div className="admin-header">
            <h1>Admin Page</h1>
        </div>
        <div className="admin-selector">
            <button>Users</button>
            <button>Posts</button>
            <button>Comments</button>
        </div>
        <div className="admin-input">
            <input type="text" placeholder="Search..." />
        </div>
        <div className="admin-product-display">
            <div className="admin-product">
                <div className="admin-product-image">
                    <img src="https://via.placeholder.com/150" alt="product" />
                </div>
                <div className="admin-product-info">
                    <h3>Product Name</h3>
                    <p>Product Description</p>
                    <p>Price: $0.00</p>
                    <button>Edit</button>
                    <button>Delete</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Admin