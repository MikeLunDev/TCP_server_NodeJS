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

module.exports.handleData = handleData;
