const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

// router.get("/", (req, res) => {
//   // Suponiendo que products contiene todos los productos
//   const products = [...];

//   res.render("home", { products });
// });

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

module.exports = router;
