const express = require("express");
const app = express();
const PORT = 8080;
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const exphbs = require("express-handlebars");

// Configuring Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Routing
app.use("/", viewsRouter);
app.use(express.static("./src/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

//Create an HTTP server
const http = require("http");
const httpServer = http.createServer(app);

//import and configure socket.io
const socket = require("socket.io");
const io = socket(httpServer);

//set up the "connection" server
io.on("connection", (socket) => {
  console.log("A client connected to root");

  socket.on("message", (data) => {
    console.log(data);
    io.sockets.emit("message", data);

    //Server send a message to the client
    socket.emit("serverMessage", "Hi client, how are u?");
  });
});

// Manejar el evento 'connection' para la ruta '/realtimeproducts'
io.of("/realtimeproducts").on("connection", (socket) => {
  console.log("A client connected to root /realtimeproducts.");
  // Resto del código para manejar los eventos de WebSocket en la ruta '/realtimeproducts'
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
