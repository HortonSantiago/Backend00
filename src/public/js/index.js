console.log("Desde el public, por consola, Funcionando!");

const socket = io();
socket.emit("message", "HI this is a Message for the client");

// Recive message from server
socket.on("serverMessage", (data) => {
  console.log(data);
});
