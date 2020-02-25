const express = require("express");
const router = express.Router();
const socketsArray = require("../server");

router.get("/info/:device_id", async (req, res) => {
  if (req.params.device_id !== undefined) {
    const { sockets } = socketsArray;
    let index = sockets.findIndex(socket => socket.device_id === req.params.device_id);
    if (index != -1) {
      res.status(200).send("Information sent to the server!");
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
      res.status(200).send(`Vehicle with ${req.params.device_id} will be notified.`);
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
      if (req.body.command === "HEY YOU, RUN!" || req.body.command === "HEY YOU, REST!") {
        res.status(200).send(`Vehicle with ${req.params.device_id} will change it's current state if possible.`);
        sockets[index].write(req.body.command + "\n");
      } else {
        res.status(400).send(`${req.body.command} is not a valid command.`);
      }
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
      if (req.body.command === "GOTTA GO.") {
        res.status(200).send(`Connection with vehicle ${req.params.device_id} will be ended.`);
        sockets[index].write(req.body.command + "\n");
      } else {
        res.status(400).send(`${req.body.command} is not a valid command.`);
      }
    } else {
      res.status(404).send(`Device with id ${req.params.device_id} not found`);
    }
  } else {
    res.status(400).send({ errors: "Device_id not defined or command is missing" });
  }
});

module.exports = router;
