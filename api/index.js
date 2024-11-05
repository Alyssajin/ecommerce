import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";
import axios from 'axios';
import e from "express";

const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// Auth0 configuration for user roles
const user_roles_config = (auth0Id) => {
  return {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://dev-spu6ftuffvna3z2w.us.auth0.com/api/v2/users/${auth0Id}/roles`,
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdWeHpGQ1diS3IyY3VZcUNCMEc5SSJ9.eyJpc3MiOiJodHRwczovL2Rldi1zcHU2ZnR1ZmZ2bmEzejJ3LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJDdmk2VE9YSG9GVmF6Ymw2dGVDc2h3d3pFR296aWVFWEBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kZXYtc3B1NmZ0dWZmdm5hM3oydy51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTczMDc1ODQ4OCwiZXhwIjoxNzMwODQ0ODg4LCJzY29wZSI6InJlYWQ6Y2xpZW50X2dyYW50cyBjcmVhdGU6Y2xpZW50X2dyYW50cyBkZWxldGU6Y2xpZW50X2dyYW50cyB1cGRhdGU6Y2xpZW50X2dyYW50cyByZWFkOnVzZXJzIHVwZGF0ZTp1c2VycyBkZWxldGU6dXNlcnMgY3JlYXRlOnVzZXJzIHJlYWQ6dXNlcnNfYXBwX21ldGFkYXRhIHVwZGF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgZGVsZXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcnNfYXBwX21ldGFkYXRhIHJlYWQ6dXNlcl9jdXN0b21fYmxvY2tzIGNyZWF0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgZGVsZXRlOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl90aWNrZXRzIHJlYWQ6Y2xpZW50cyB1cGRhdGU6Y2xpZW50cyBkZWxldGU6Y2xpZW50cyBjcmVhdGU6Y2xpZW50cyByZWFkOmNsaWVudF9rZXlzIHVwZGF0ZTpjbGllbnRfa2V5cyBkZWxldGU6Y2xpZW50X2tleXMgY3JlYXRlOmNsaWVudF9rZXlzIHJlYWQ6Y29ubmVjdGlvbnMgdXBkYXRlOmNvbm5lY3Rpb25zIGRlbGV0ZTpjb25uZWN0aW9ucyBjcmVhdGU6Y29ubmVjdGlvbnMgcmVhZDpyZXNvdXJjZV9zZXJ2ZXJzIHVwZGF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGRlbGV0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGNyZWF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIHJlYWQ6ZGV2aWNlX2NyZWRlbnRpYWxzIHVwZGF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgZGVsZXRlOmRldmljZV9jcmVkZW50aWFscyBjcmVhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIHJlYWQ6cnVsZXMgdXBkYXRlOnJ1bGVzIGRlbGV0ZTpydWxlcyBjcmVhdGU6cnVsZXMgcmVhZDpydWxlc19jb25maWdzIHVwZGF0ZTpydWxlc19jb25maWdzIGRlbGV0ZTpydWxlc19jb25maWdzIHJlYWQ6aG9va3MgdXBkYXRlOmhvb2tzIGRlbGV0ZTpob29rcyBjcmVhdGU6aG9va3MgcmVhZDphY3Rpb25zIHVwZGF0ZTphY3Rpb25zIGRlbGV0ZTphY3Rpb25zIGNyZWF0ZTphY3Rpb25zIHJlYWQ6ZW1haWxfcHJvdmlkZXIgdXBkYXRlOmVtYWlsX3Byb3ZpZGVyIGRlbGV0ZTplbWFpbF9wcm92aWRlciBjcmVhdGU6ZW1haWxfcHJvdmlkZXIgYmxhY2tsaXN0OnRva2VucyByZWFkOnN0YXRzIHJlYWQ6aW5zaWdodHMgcmVhZDp0ZW5hbnRfc2V0dGluZ3MgdXBkYXRlOnRlbmFudF9zZXR0aW5ncyByZWFkOmxvZ3MgcmVhZDpsb2dzX3VzZXJzIHJlYWQ6c2hpZWxkcyBjcmVhdGU6c2hpZWxkcyB1cGRhdGU6c2hpZWxkcyBkZWxldGU6c2hpZWxkcyByZWFkOmFub21hbHlfYmxvY2tzIGRlbGV0ZTphbm9tYWx5X2Jsb2NrcyB1cGRhdGU6dHJpZ2dlcnMgcmVhZDp0cmlnZ2VycyByZWFkOmdyYW50cyBkZWxldGU6Z3JhbnRzIHJlYWQ6Z3VhcmRpYW5fZmFjdG9ycyB1cGRhdGU6Z3VhcmRpYW5fZmFjdG9ycyByZWFkOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGRlbGV0ZTpndWFyZGlhbl9lbnJvbGxtZW50cyBjcmVhdGU6Z3VhcmRpYW5fZW5yb2xsbWVudF90aWNrZXRzIHJlYWQ6dXNlcl9pZHBfdG9rZW5zIGNyZWF0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIGRlbGV0ZTpwYXNzd29yZHNfY2hlY2tpbmdfam9iIHJlYWQ6Y3VzdG9tX2RvbWFpbnMgZGVsZXRlOmN1c3RvbV9kb21haW5zIGNyZWF0ZTpjdXN0b21fZG9tYWlucyB1cGRhdGU6Y3VzdG9tX2RvbWFpbnMgcmVhZDplbWFpbF90ZW1wbGF0ZXMgY3JlYXRlOmVtYWlsX3RlbXBsYXRlcyB1cGRhdGU6ZW1haWxfdGVtcGxhdGVzIHJlYWQ6bWZhX3BvbGljaWVzIHVwZGF0ZTptZmFfcG9saWNpZXMgcmVhZDpyb2xlcyBjcmVhdGU6cm9sZXMgZGVsZXRlOnJvbGVzIHVwZGF0ZTpyb2xlcyByZWFkOnByb21wdHMgdXBkYXRlOnByb21wdHMgcmVhZDpicmFuZGluZyB1cGRhdGU6YnJhbmRpbmcgZGVsZXRlOmJyYW5kaW5nIHJlYWQ6bG9nX3N0cmVhbXMgY3JlYXRlOmxvZ19zdHJlYW1zIGRlbGV0ZTpsb2dfc3RyZWFtcyB1cGRhdGU6bG9nX3N0cmVhbXMgY3JlYXRlOnNpZ25pbmdfa2V5cyByZWFkOnNpZ25pbmdfa2V5cyB1cGRhdGU6c2lnbmluZ19rZXlzIHJlYWQ6bGltaXRzIHVwZGF0ZTpsaW1pdHMgY3JlYXRlOnJvbGVfbWVtYmVycyByZWFkOnJvbGVfbWVtYmVycyBkZWxldGU6cm9sZV9tZW1iZXJzIHJlYWQ6ZW50aXRsZW1lbnRzIHJlYWQ6YXR0YWNrX3Byb3RlY3Rpb24gdXBkYXRlOmF0dGFja19wcm90ZWN0aW9uIHJlYWQ6b3JnYW5pemF0aW9uc19zdW1tYXJ5IGNyZWF0ZTphdXRoZW50aWNhdGlvbl9tZXRob2RzIHJlYWQ6YXV0aGVudGljYXRpb25fbWV0aG9kcyB1cGRhdGU6YXV0aGVudGljYXRpb25fbWV0aG9kcyBkZWxldGU6YXV0aGVudGljYXRpb25fbWV0aG9kcyByZWFkOm9yZ2FuaXphdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIGNyZWF0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgcmVhZDpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBkZWxldGU6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBjcmVhdGU6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIHJlYWQ6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25faW52aXRhdGlvbnMgcmVhZDpzY2ltX2NvbmZpZyBjcmVhdGU6c2NpbV9jb25maWcgdXBkYXRlOnNjaW1fY29uZmlnIGRlbGV0ZTpzY2ltX2NvbmZpZyBjcmVhdGU6c2NpbV90b2tlbiByZWFkOnNjaW1fdG9rZW4gZGVsZXRlOnNjaW1fdG9rZW4gZGVsZXRlOnBob25lX3Byb3ZpZGVycyBjcmVhdGU6cGhvbmVfcHJvdmlkZXJzIHJlYWQ6cGhvbmVfcHJvdmlkZXJzIHVwZGF0ZTpwaG9uZV9wcm92aWRlcnMgZGVsZXRlOnBob25lX3RlbXBsYXRlcyBjcmVhdGU6cGhvbmVfdGVtcGxhdGVzIHJlYWQ6cGhvbmVfdGVtcGxhdGVzIHVwZGF0ZTpwaG9uZV90ZW1wbGF0ZXMgY3JlYXRlOmVuY3J5cHRpb25fa2V5cyByZWFkOmVuY3J5cHRpb25fa2V5cyB1cGRhdGU6ZW5jcnlwdGlvbl9rZXlzIGRlbGV0ZTplbmNyeXB0aW9uX2tleXMgcmVhZDpzZXNzaW9ucyBkZWxldGU6c2Vzc2lvbnMgcmVhZDpyZWZyZXNoX3Rva2VucyBkZWxldGU6cmVmcmVzaF90b2tlbnMgY3JlYXRlOnNlbGZfc2VydmljZV9wcm9maWxlcyByZWFkOnNlbGZfc2VydmljZV9wcm9maWxlcyB1cGRhdGU6c2VsZl9zZXJ2aWNlX3Byb2ZpbGVzIGRlbGV0ZTpzZWxmX3NlcnZpY2VfcHJvZmlsZXMgY3JlYXRlOnNzb19hY2Nlc3NfdGlja2V0cyByZWFkOmZvcm1zIHVwZGF0ZTpmb3JtcyBkZWxldGU6Zm9ybXMgY3JlYXRlOmZvcm1zIHJlYWQ6Zmxvd3MgdXBkYXRlOmZsb3dzIGRlbGV0ZTpmbG93cyBjcmVhdGU6Zmxvd3MgcmVhZDpmbG93c192YXVsdCByZWFkOmZsb3dzX3ZhdWx0X2Nvbm5lY3Rpb25zIHVwZGF0ZTpmbG93c192YXVsdF9jb25uZWN0aW9ucyBkZWxldGU6Zmxvd3NfdmF1bHRfY29ubmVjdGlvbnMgY3JlYXRlOmZsb3dzX3ZhdWx0X2Nvbm5lY3Rpb25zIHJlYWQ6Zmxvd3NfZXhlY3V0aW9ucyBkZWxldGU6Zmxvd3NfZXhlY3V0aW9ucyByZWFkOmNvbm5lY3Rpb25zX29wdGlvbnMgdXBkYXRlOmNvbm5lY3Rpb25zX29wdGlvbnMgcmVhZDpzZWxmX3NlcnZpY2VfcHJvZmlsZV9jdXN0b21fdGV4dHMgdXBkYXRlOnNlbGZfc2VydmljZV9wcm9maWxlX2N1c3RvbV90ZXh0cyByZWFkOmNsaWVudF9jcmVkZW50aWFscyBjcmVhdGU6Y2xpZW50X2NyZWRlbnRpYWxzIHVwZGF0ZTpjbGllbnRfY3JlZGVudGlhbHMgZGVsZXRlOmNsaWVudF9jcmVkZW50aWFscyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6IkN2aTZUT1hIb0ZWYXpibDZ0ZUNzaHd3ekVHb3ppZUVYIn0.a1FRwFCKKJFT0VhCzNGVbUbsV2ApbOFhwDxLm1lzoMQxLAk_hmpXBRKZ2-rJuknyiYbymRky-4BE3d7ONbC0hsbnhD_vtO72RD5raQqJYQFP2j-EWB3_bGSZZFrwgMTLxEgIrnJxXUQkjg_27eazSlglaIBp-mQ6_sotZTblNxHfOTnjvGcQ4ug2eJDT7o8p5oVbMEZahzd_eRogYrQi1p-ts5YSnI5cHJZ1NTZGi82UjFIGXyUu45-QM5HvlG2E1PXycsvGyLdnHyILlMKrlu0K-z5Txw_8E1vQjFgEyMY-aCrxXJnR_vKp9-cmhbWnjzvIOJQEkNTcgFAuyGP40A'
    }
  }
};

// Middleware to check the user role
const fetchUserRole = async (auth0Id) => {
  let role;
  try {
    const response = await axios(user_roles_config(auth0Id));
    if (response.data && response.data.length > 0) {
      role = response.data[0].name;
    } else {
      role = 'user'; // Default role if no roles are found
    }
    console.log(role);
  } catch (error) {
    console.log(error);
    role = 'user'; // Default role in case of error
  }
  return role;
};

/////// CREATE ENDPOINTS /////
// this endpoint is used by the client to verify the user status and to make sure the user is registered in our database once they signup with Auth0
// if not registered in our database we will create it.
// if the user is already registered we will return the user information
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });

    res.json(newUser);
  }
});

// Create a new product
app.post("/products", requireAuth, async (req, res) => {

  const auth0Id = req.auth.payload.sub;

  const role = await fetchUserRole();

  if (role === 'user') {
    return res.status(401).json({ success: 0, error: "Unauthorized" });
  }

  const { brand, name, price, image, link, category, description } = req.body;


  if (!brand || !name || !price || !image || !link) {
    return res.status(400).json({ error: "Missing required fields" });
  } else {
    const product = await prisma.product.create({
      data: {
        brand,
        name,
        price: parseFloat(price.replace(/[^\d.]/g, '')),
        image,
        link,
        category,
        description
      },
    });
    console.log("description", description);
    res.status(201).json({ success: 1, product });
  }
});

// Create a new cart
app.post("/cart", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
  // Check if the user exists
  if (!user) {
    return res.status(401).json({ success: 0, error: "Unauthorized" });
  }
  // Check if the user already has a cart
  const existingCart = await prisma.cart.findFirst({
    where: {
      userId: user.id,
    },
  });
  if (existingCart) {
    return res.status(401).json({
      success: 0,
      error: "Cart already exists"
    });
  }

  const cart = await prisma.cart.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      total: 0,

    },
  });
  res.status(201).json({ success: 1, cart });
});


// Create a new cartItem
app.post("/cartItem", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { productId, quantity } = req.body;

  if (!quantity || !productId) {
    return res.status(400).json({ success: 0, error: "Missing required fields" });
  } else {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    const cart = await prisma.cart.findFirst({
      where: {
        userId: user.id,
      },
    });

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    if (existingCartItem) {
      return res.status(401).json({ success: 0, error: "Product-cart already exists" });
    }


    const cartItem = await prisma.cartItem.create({
      data: {
        quantity,
        product: {
          connect: {
            id: productId,
          },
        },
        cart: {
          connect: {
            id: cart.id,
          },
        },
      },
    });

    res.status(201).json({ success: 1, cartItem });
  }
});


///// READ ENDPOINTS /////
// Read profile information of authenticated user
app.get("/me", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (!user) {
    return res.status(401).json({ success: 0, error: "Unauthorized" });
  }

  res.status(200).json(user);
});

// get products by cartItem id
app.get("/cartItem/:id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (!user) {
    return res.status(401).json({ success: 0, error: "Unauthorized" });
  }

  const { id } = req.params;
  const cartItem = await prisma.cartItem.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  res.status(200).json({ success: 1, cartItem });
});

// get all products in cart by user id
app.get("/cart", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (!user) {
    return res.status(401).json({ success: 0, error: "Unauthorized" });
  }

  let cart = await prisma.cart.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: user.id,
        total: 0,
      },
    });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: {
      cartId: cart.id,
    },
  });

  let total = 0;

  const cartData = [];
  const cartId = cart.id;

  for (let i = 0; i < cartItems.length; i++) {
    const p = await prisma.product.findUnique({
      where: {
        id: cartItems[i].productId,
      },
    });
    const quantity = cartItems[i].quantity;
    const t = p.price * quantity;
    total += t;
    const product = { product: p, quantity: quantity, total: t, id: cartItems[i].id };

    cartData.push(product);
  }

  res.status(200).json({ success: 1, cartId: cartId, cartData });
});

// Admin endpoint to get all users (need to be modified to only allow admin users)
// Read all products and requireAuth middleware will make sure the user is authenticated
app.get("/products", async (req, res) => {
  const products = await prisma.product.findMany();
  res.status(200).json({ success: 1, products });
});

// Read a product by id
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!product) {
      res.status(404).json({ success: 0, error: "Product with given id not found" });
      return;
    }

    res.status(200).json({ success: 1, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: 0, error: "An error occurred while fetching product" });
  }
});

// Read a product by brand
app.get("/products/brand/:brand", async (req, res) => {
  const { brand } = req.params;
  const products = await prisma.product.findMany({
    where: {
      brand,
    },
  });
  res.status(200).json({ success: 1, products });
});

// Read a product by name
app.get("/products/name/:name", async (req, res) => {

  const { name } = req.params;
  const products = await prisma.product.findMany({
    where: {
      name,
    },
  });
  res.status(200).json({ success: 1, products });
});

// Read products by category
app.get("/products/category/:category", async (req, res) => {
  const { category } = req.params;
  const products = await prisma.product.findMany({
    where: {
      category,
    },
  });
  res.status(200).json({ success: 1, products });
}
);

// Search products by name, brand, or category
app.get("/search", async (req, res) => {

  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ success: 0, error: "Query parameter is required" });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { brand: { contains: query } },
          { category: { contains: query } },
        ],
      },
    });
    console.log("products", products);
    if (products.length === 0) {
      return res.status(404).json({ success: 0, error: "No products found" });
    }
    res.status(200).json({ success: 1, products });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ success: 0, error: "An error occurred while searching for products" });
  }
});


///// UPDATE ENDPOINTS /////
// Update a product by id (only admin users can update products)
app.put("/products/:id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const role = await fetchUserRole(auth0Id);

  if (role === 'user') {
    return res.status(401).json({ success: 0, error: "Unauthorized" });
  }

  const { brand, name, price, image, link, category, description } = req.body;
  const { id } = req.params;

  if (!brand || !name || !price || !image || !link) {
    return res.status(400).json({ success: 0, error: "Missing required fields" });
  } else {
    const product = await prisma.product.update({
      where: {
        id: parseInt(id),
      },
      data: {
        brand,
        name,
        price: parseFloat(price.replace(/[^\d.]/g, '')),
        image,
        link,
        category,
        description
      },
    });
    res.status(200).json({ success: 1, product });
  }
});

// Update a cartItem by id
app.put("/cartItem/:id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { quantity } = req.body;
  const { id } = req.params;

  if (!quantity) {
    return res.status(400).json({ success: 0, error: "Missing required fields" });
  } else {
    const cartItem = await prisma.cartItem.update({
      where: {
        id: parseInt(id),
      },
      data: {
        quantity,
      },
    });
    res.status(200).json({ success: 1, cartItem });
  }
});

// Update a cart by id
app.put("/cart/:id", requireAuth, async (req, res) => {

  const { productId } = req.body;
  const { id } = req.params;
  // check if the cartId exists
  const cartId = await prisma.cart.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!cartId) {
    return res.status(400).json({ success: 0, error: "Cart not found" });
  }

  if (!productId) {
    console.log("productId", productId);
    return res.status(400).json({ success: 0, error: "Missing required fields" });
  }
  // Check if the product exists
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) {
    return res.status(400).json({ success: 0, error: "Product not found" });
  }

  // Find the cartItem by productId
  let cartItem = await prisma.cartItem.findFirst({
    where: {
      cartId: parseInt(id),
      productId: productId,
    },
  });

  // If the cartItem exists, update the quantity, otherwise create a new cartItem
  if (cartItem) {
    cartItem = await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        quantity: cartItem.quantity + 1,
      },
    });
  } else {
    cartItem = await prisma.cartItem.create({
      data: {
        quantity: 1,
        productId,
        cartId: parseInt(id),
      },
    });
  }

  // Calculate the total for the cart
  const cartItems = await prisma.cartItem.findMany({
    where: {
      cartId: parseInt(id),
    },
    include: {
      product: true, // Include the related product to access the price
    },
  });

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Update the cart with the new total
  const cart = await prisma.cart.update({
    where: {
      id: parseInt(id),
    },
    data: {
      total,
    },
  });

  res.status(200).json({ success: 1, cart });
});

///// DELETE ENDPOINTS /////
// Delete a product by id (only admin users can delete products)
app.delete("/products/:id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const role = await fetchUserRole(auth0Id);

  if (role === 'user') {
    return res.status(401).json({ success: 0, error: "Unauthorized" });
  }
  const { id } = req.params;
  const product = await prisma.product.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.status(200).json({ success: 1, product });
});

// Delete a cartItem by id
app.delete("/cartItem/:id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { id } = req.params;
  const cartItem = await prisma.cartItem.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.status(200).json({ success: 1, cartItem });
});

// Delete a cart by id
app.delete("/cart/:id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { id } = req.params;
  const { productId } = req.body;

  try {
    let cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: parseInt(id),
        productId: productId,
      },
    });

    if (!cartItem) {
      return res.status(400).json({ success: 0, error: "Cart item not found" });
    }

    if (cartItem.quantity > 1) {
      cartItem = await prisma.cartItem.update({
        where: {
          id: cartItem.id,
        },
        data: {
          quantity: {
            decrement: 1,
          },
        },
      });
    } else {
      await prisma.cartItem.delete({
        where: {
          id: cartItem.id,
        },
      });
    }
    // Recalculate the cart total after item deletion or update
    const updatedCartItems = await prisma.cartItem.findMany({
      where: {
        cartId: parseInt(id),
      },
      include: {
        product: true,
      },
    });

    const updatedTotal = updatedCartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // Update the cart with the new total
    const updatedCart = await prisma.cart.update({
      where: {
        id: parseInt(id),
      },
      data: {
        total: updatedTotal,
      },
    });

    res.status(200).json({ success: 1, cartItem });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ success: 0, error: "An error occurred while deleting cart item" });
  }

});


const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});
