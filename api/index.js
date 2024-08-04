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
app.get("/", (req, res) => {
  res.send("pong");
});

/////// CREATE ENDPOINTS /////
// this endpoint is used by the client to verify the user status and to make sure the user is registered in our database once they signup with Auth0
// if not registered in our database we will create it.
// if the user is already registered we will return the user information
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  // we are using the audience to get the email and name from the token
  // if your audience is different you should change the key to match your audience
  // the value should match your audience according to this document: https://docs.google.com/document/d/1lYmaGZAS51aeCxfPzCwZHIk6C5mmOJJ7yHBNPJuGimU/edit#heading=h.fr3s9fjui5yn
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
  }

  //   // create a cart for every new user
  //   let cart = await prisma.cart.create({
  //     data: {
  //       user: {
  //         connect: {
  //           auth0Id,
  //         },
  //       },
  //       total: 0,
  //     },
  //   });

  //   res.json(newUser);
  // }
});

// Create a new product
app.post("/products", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { brand, name, price, image, link } = req.body;

  if (!brand || !name || !price || !image || !link) {
    return res.status(400).json({ error: "Missing required fields" });
  } else {
    const product = await prisma.product.create({
      data: {
        brand,
        name,
        price,
        image,
        link,
        user: {
          connect: {
            auth0Id,
          },
        },
      },
    });
    res.status(201).json(product);
  }
});

// Create a new cartItem
app.post("/cartItem", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ error: "Missing required fields" });
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

    res.status(201).json(cartItem);
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
    return res.status(401).json({ error: "Unauthorized" });
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
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.params;
  const cartItem = await prisma.cartItem.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  const productId = cartItem.productId;
  const quantity = cartItem.quantity;
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  res.status(200).json(product, quantity);
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
    return res.status(401).json({ error: "Unauthorized" });
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

  const cartData = [];
  for (let i = 0; i < cartItems.length; i++) {
    const p = await prisma.product.findUnique({
      where: {
        id: cartItems[i].productId,
      },
    });
    const quantity = cartItems[i].quantity;
    const product = { product: p, quantity: quantity };
    cartData.push(product);
  }

  res.status(200).json(cartData);
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
  res.status(200).json(products);
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
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  res.status(200).json(product);
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
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { brand } = req.params;
  const products = await prisma.product.findMany({
    where: {
      brand,
    },
  });
  res.status(200).json(products);
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
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { name } = req.params;
  const products = await prisma.product.findMany({
    where: {
      name,
    },
  });
  res.status(200).json(products);
});



app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
