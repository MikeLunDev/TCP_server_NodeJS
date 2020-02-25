const net = require("net");
const port = 7070;
const host = "127.0.0.1";
const express = require("express");
const vehicleRouter = require("./routes/vehicleRouter");
const { handleData } = require("./utils/utils");

//HTTP SERVER
const app = express();
app.set("port", process.env.PORT || 3055);
app.use(express.json());
app.use("/scooter", vehicleRouter);
app.listen(app.get("port"), () => {
  console.log("HTTP SERVER RUNNING ON PORT", app.get("port"));
});

//TCP SERVER
const server = net.createServer();
server.listen(port, host, () => {
  console.log("TCP Server is running on port " + port + ".");
});

let sockets = [];
server.on("connection", sock => {
  sockets.push(sock);
  //Dare dei response alle fetch
  sock.on("data", data => {
    handleData(data, sock);
  });

  // Add a 'close' event handler to this instance of socket
  sock.on("close", () => {
    //deleting the socket that triggers the close event from the list
    let index = sockets.findIndex(el => el.remoteAddress === sock.remoteAddress && el.remotePort === sock.remotePort);
    if (index !== -1) sockets.splice(index, 1);
  });
  sock.on("error", err => {
    console.log(`ERROR: ${err.message} with client ${sock.device_id}`);
  });
});

server.on("error", err => {
  console.log(`Internal server error: ${err.message}`);
});

module.exports.sockets = sockets;
