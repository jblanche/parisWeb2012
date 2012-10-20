var five = require('johnny-five'),
    io = require('socket.io').listen(8080),
    board, potentiometer;

board = new five.Board();

board.on("ready", function() {

  // Create a new `potentiometer` hardware instance.
  potentiometer = new five.Sensor({
    pin: "A0"
  });


  // "read" get the current reading from the potentiometer
  potentiometer.on("read", function( err, value ) {
    //console.log(value, this.normalized );
    board.emit('value', this.normalized);
  });
});


io.sockets.on('connection', function (socket) {
  board.on('value', function(val){
      socket.emit('value', {val: val});
  });
});
