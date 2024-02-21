const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cart-manager.js");
const cartManager = new CartManager("./src/models/carts.json");

// Ruta para obtener todos los carritos
router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.json(carts);
  } catch (error) {
    console.error("Error al obtener carritos", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Ruta para obtener un carrito por su id
router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await cartManager.getCart(cartId);
    res.json(cart);
  } catch (error) {
    console.error("Error al obtener carrito", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Ruta para agregar un producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;
  try {
    const result = await cartManager.addProductToCart(
      cartId,
      productId,
      quantity
    );
    res.json(result);
  } catch (error) {
    console.error("Error al agregar producto al carrito", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
