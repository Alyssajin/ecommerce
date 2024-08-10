import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";

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

// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/ping", (req, res) => {
  res.send("pong");
});

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
  const { brand, name, price, image, link, category } = req.body;

  if (!brand || !name || !price || !image || !link) {
    return res.status(400).json({ error: "Missing required fields" });
  } else {
    const product = await prisma.product.create({
      data: {
        brand,
        name,
        price: parseFloat(price.slice(4)),
        image,
        link,
        category,
      },
    });
    res.status(201).json({success:1, product});
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
  res.status(201).json({success: 1, cart});
});


// Create a new cartItem
app.post("/cartItem", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { productId, quantity } = req.body;

  if (!quantity || !productId) {
    return res.status(400).json({success:0, error: "Missing required fields" });
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

    res.status(201).json({success: 1, cartItem});
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

  res.status(200).json({success: 1, cartItem});
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
    return res.status(401).json({success: 0, error: "Unauthorized" });
  }

  const cart = await prisma.cart.findFirst({
    where: {
      userId: user.id,
    },
  });

  const cartItems = await prisma.cartItem.findMany({
    where: {
      cartId: cart.id,
    },
  });

  let total = 0;

  const cartData = [];
  for (let i = 0; i < cartItems.length; i++) {
    const p = await prisma.product.findUnique({
      where: {
        id: cartItems[i].productId,
      },
    });
    const quantity = cartItems[i].quantity;
    const t = p.price * quantity;
    total += t;
    const product = { product: p, quantity: quantity, total: t };

    cartData.push(product);
  }

  res.status(200).json({success: 1, cartData});
});

// Admin endpoint to get all users (need to be modified to only allow admin users)
// Read all products and requireAuth middleware will make sure the user is authenticated
app.get("/products", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const products = await prisma.product.findMany();
  res.status(200).json({success: 1,products});
});

// Read a product by id
app.get("/products/:id", requireAuth, async (req, res) => {
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
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  res.status(200).json({success: 1, product});
});

// Read a product by brand
app.get("/products/brand/:brand", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (!user) {
    return res.status(401).json({ success: 0, error: "Unauthorized" });
  }
  const { brand } = req.params;
  const products = await prisma.product.findMany({
    where: {
      brand,
    },
  });
  res.status(200).json({success: 1, products});
});

// Read a product by name
app.get("/products/name/:name", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (!user) {
    return res.status(401).json({ success: 0, error: "Unauthorized" });
  }
  const { name } = req.params;
  const products = await prisma.product.findMany({
    where: {
      name,
    },
  });
  res.status(200).json({success: 1, products});
});

// Read products by category
app.get("/products/category/:category", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (!user) {
    return res.status(401).json({ success: 0, error: "Unauthorized" });
  }
  const { category } = req.params;
  const products = await prisma.product.findMany({
    where: {
      category,
    },
  });
  res.status(200).json({success: 1, products});
}
);

///// UPDATE ENDPOINTS /////
// Update a product by id
app.put("/products/:id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { brand, name, price, image, link, category } = req.body;
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
        price: parseFloat(price.slice(4)),
        image,
        link,
        category,
      },
    });
    res.status(200).json({success: 1, product});
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
    res.status(200).json({success: 1, cartItem});
  }
});

// Update a cart by id
app.put("/cart/:id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { total } = req.body;
  const { id } = req.params;

  if (!total) {
    return res.status(400).json({ success: 0, error: "Missing required fields" });
  } else {
    const cart = await prisma.cart.update({
      where: {
        id: parseInt(id),
      },
      data: {
        total,
      },
    });
    res.status(200).json({success: 1, cart});
  }
});

///// DELETE ENDPOINTS /////
// Delete a product by id
app.delete("/products/:id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { id } = req.params;
  const product = await prisma.product.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.status(200).json({success: 1, product});
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
  res.status(200).json({success: 1, cartItem});
});

// Delete a cart by id
app.delete("/cart/:id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { id } = req.params;

  await prisma.cartItem.deleteMany({
    where: {
      cartId: parseInt(id),
    },
  });

  await prisma.cart.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.status(200).json({success: 1});
});


app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
