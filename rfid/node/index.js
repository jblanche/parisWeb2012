var HID = require('HID');
var io = require('socket.io').listen(5000);

var socket;
var devices = new HID.devices(7592, 4865);
var hid;

if (!devices.length) {
  console.log("No mir:ror found");
} else {
  hid = new HID.HID(devices[0].path);
  console.log('mir:ror found');
  io.sockets.on('connection', listen);
}


function listen (_socket) {
    socket = _socket;
    hid.read(onRead);
}

function onRead(error, data) {
  var size;
  var id;
  var dataType;
  var color;

  //get 64 bytes
  if (data[0] != 0) {

    console.log("\n" + data.map(function (v) {return ('00' + v.toString(16)).slice(-2)}).join(','));

    switch (data[0]) {
    case 1:
      //Orientation change
      switch (data[1]) {
      case 4:
        socket.emit('mir:ror-up');
        console.log("-> mir:ror up");
        break;
      case 5:
        socket.emit('mir:ror-down');
        console.log("-> mir:ror down");
        break;
      }
      break;
    case 2:
      //RFID
      size = data[4];
      dataType = data[1];
      id = (data.splice(0)).splice(5, size);
      console.log(id);

      switch(id.splice(-1)[0]){
        case 137:
            color = 'yellow';
            break;
        case 217:
            color = 'purple';
            break;
      }
      console.log(data);

      switch (dataType) {
      case 1:
        socket.emit('RFID-in', color);
        console.log("-> RFID in", color);
        break;
      case 2:
        socket.emit('RFID-out', color);
        console.log("-> RFID out", color);
        break;
      }

      break;
    }
  }
  hid.read(onRead);
}
