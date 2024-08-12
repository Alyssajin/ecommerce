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
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  res.status(200).json({ success: 1, product });
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

///// UPDATE ENDPOINTS /////
// Update a product by id
app.put("/products/:id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
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
// Delete a product by id
app.delete("/products/:id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
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


app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
