# E-commerce Application

This is an e-commerce application built with React, Node.js, Express, and Prisma. The application uses Auth0 for authentication and authorization.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization with Auth0
- Product listing and categorization
- Shopping cart functionality
- Admin dashboard for managing products and users
- Responsive design

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/ecommerce.git
   cd ecommerce
2. Install dependencies for the client and server:
    ```sh
    cd client
    npm install
    cd ../api
    npm install

## Environment Variables
Create a .env file in the client and api directories with the following environment variables:
### Client .env
    ```
    REACT_APP_API_URL=http://localhost:8080
    REACT_APP_AUTH0_DOMAIN=dev-spu6ftuffvna3z2w.us.auth0.com
    REACT_APP_AUTH0_CLIENT_ID=iNVEYO5otOUQuzluOqip0tboOLHPwztt
    REACT_APP_AUTH0_AUDIENCE=https://api.ecommerce
    REACT_APP_AUTH0_NAME_SPACE=https://api.ecommerce/roles

    DEPLOY_REACT_APP_API_URL=https://ecommerce-byqe.onrender.com
    DEPLOY_REACT_APP_AUTH0_DOMAIN=dev-spu6ftuffvna3z2w.us.auth0.com
    DEPLOY_REACT_APP_AUTH0_CLIENT_ID=iNVEYO5otOUQuzluOqip0tboOLHPwztt
    DEPLOY_REACT_APP_AUTH0_AUDIENCE=https://api.ecommerce
    ```
### API .env
    ```
    DATABASE_URL=mysql://root:111111@localhost:3306/ecommerce
    AUTH0_AUDIENCE=https://api.ecommerce
    AUTH0_ISSUER=https://dev-spu6ftuffvna3z2w.us.auth0.com
    AUTH0_API_TOKEN=your_auth0_api_token
    ```

## Running the Application
1. Start the API server:
    ```sh
    cd api
    npm start
2. Start the client application:
    ```sh
    cd client
    npm start
3. Open your browser and navigate to http://localhost:3000.

## Project Structure
```
ecommerce/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   ├── index.js
│   └── .env
├── api/
│   ├── prisma/
│   │   ├── schema.prisma
│   ├── src/
│   │   ├── index.js
│   └── .env
├── README.md
└── [package.json](http://_vscodecontentref_/0)
```

## Usage
- Home Page: Browse products and categories.
- Admin Dashboard: Manage products and users (accessible only to admin users).
- User Dashboard: View and manage your account and orders.
- Shopping Cart: Add products to your cart and proceed to checkout.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.


