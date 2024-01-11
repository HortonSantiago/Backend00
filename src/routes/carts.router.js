const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager("./src/models/carts.json");

// Rutas:
router.get("/carts", async (req, res) => {
  try {
    const carts = await productManager.getProducts(); // Cambiado a productManager
    res.json(carts);
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.json({ error: "Error del servidor" });
  }
});

router.post("/carts", async (req, res) => {
  try {
    const nuevoCarrito = req.body;
    await productManager.addProduct(nuevoCarrito); // Cambiado a productManager
    res.json({ message: "Carrito creado correctamente" });
  } catch (error) {
    console.error("Error al crear carrito", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

router.get("/carts/:cid", async (req, res) => {
  const id = req.params.cid;

  try {
    const productosEnCarrito = await productManager.getCartProducts(
      parseInt(id)
    );
    res.json(productosEnCarrito);
  } catch (error) {
    console.error("Error al obtener productos del carrito", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

router.post("/carts/:cid/product/:pid", async (req, res) => {
  const carritoId = req.params.cid;
  const productoId = req.params.pid;

  try {
    await productManager.addProductToCart(
      parseInt(carritoId),
      parseInt(productoId)
    );
    res.json({ message: "Producto agregado al carrito correctamente" });
  } catch (error) {
    console.error("Error al agregar producto al carrito", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

module.exports = router;
