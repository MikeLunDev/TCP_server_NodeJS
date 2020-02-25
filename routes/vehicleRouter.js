const express = require("express");
const router = express.Router();
const socketsArray = require("../server");

router.get("/info/:device_id", async (req, res) => {
  if (req.params.device_id !== undefined) {
    const { sockets } = socketsArray;
    let index = sockets.findIndex(socket => socket.device_id === req.params.device_id);
    if (index != -1) {
      sockets[index].write("HOW'S IT GOING?\n");
    } else {
      res.status(404).send(`Device with id ${req.params.device_id} not found`);
    }
  } else {
    res.status(400).send("Device_id missing");
  }
});

router.post("/set_update_frequency/:device_id", async (req, res) => {
  if (req.params.device_id !== undefined && !isNaN(parseInt(req.body.interval))) {
    const { sockets } = socketsArray;
    let index = sockets.findIndex(socket => socket.device_id === req.params.device_id);
    if (index != -1) {
      sockets[index].write(`KEEP ME POSTED EVERY ${parseInt(req.body.interval)} SECONDS.\n`);
    } else {
      res.status(404).send(`Device with id ${req.params.device_id} not found`);
    }
  } else {
    res.status(400).send({ errors: "Device_id not defined or interval is missing or not a number" });
  }
});

router.post("/change_vehicle_state/:device_id", async (req, res) => {
  if (req.params.device_id !== undefined && req.body.command !== undefined) {
    const { sockets } = socketsArray;
    let index = sockets.findIndex(socket => socket.device_id === req.params.device_id);
    if (index != -1) {
      sockets[index].write(req.body.command + "\n");
    } else {
      res.status(404).send(`Device with id ${req.params.device_id} not found`);
    }
  } else {
    res.status(400).send({ errors: "Device_id not defined or command is missing" });
  }
});

router.post("/end_connection/:device_id", async (req, res) => {
  if (req.params.device_id !== undefined && req.body.command !== undefined) {
    const { sockets } = socketsArray;
    let index = sockets.findIndex(socket => socket.device_id === req.params.device_id);
    if (index != -1) {
      sockets[index].write(req.body.command + "\n");
    } else {
      res.status(404).send(`Device with id ${req.params.device_id} not found`);
    }
  } else {
    res.status(400).send({ errors: "Device_id not defined or command is missing" });
  }
});

module.exports = router;
