const net = require("net");
const port = 7070;
const host = "127.0.0.1";
const express = require("express");
const vehicleRouter = require("./routes/vehicleRouter");

//da fare cambiare i protocolli con \n e looppare i comandi
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
  sock.on("close", data => {
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

const handleData = (data, sock) => {
  let dataFromClientString = data.toString("ascii");
  dataFromClientString.split("\n").forEach(command => {
    console.log(command);
    if (command === "PING.") {
      sock.write("PONG.\n");
    }
    let dataFromClientArray = command.split(" ");
    //checking if it is the connecting message which includes a uuid
    if (/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/.test(dataFromClientArray[3])) {
      //set the uuid as unique id of that specific socket
      sock.device_id = dataFromClientArray[3].slice(0, dataFromClientArray[3].length - 1);
      sock.write("HI,  NICE TO MEET YOU!\n");
    }
    if (dataFromClientArray[0] === "REPORT.") {
      sock.write("OK, THANKS!\n");
    }
    if (command === "GOTTA GO.") {
      sock.write("SEE YA.\n");
      sock.end();
    }
  });
};

module.exports.sockets = sockets;
