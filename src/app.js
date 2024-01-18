const express = require("express");
const app = express();
const { router } = require("./routes/products.router"); //import only router
const server = require("http").createServer(app); // server http the app goes to the server
const io = require("socket.io")(server);
const PUERTO = 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes:
app.use("/api", router); // only one router here

// Middleware to control errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// servers start
server.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});
