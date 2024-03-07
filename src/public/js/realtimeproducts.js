console.log("Desde el public, por consola, Funcionando!");

const socket = io("/realtimeproducts");
socket.emit("message", "HI this is a Message for the client");

// Recive message from server
socket.on("serverMessage", (data) => {
  console.log(data);
});

// Handle product updates
socket.on("productUpdate", (products) => {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";
  products.forEach((product) => {
    const productItem = document.createElement("li");
    productItem.textContent = `${product.name} - ${product.price}`;
    productList.appendChild(productItem);
  });
});
