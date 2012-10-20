var five = require('johnny-five'),
    board, servo, potentiometer, socket,
    io = require('socket.io').listen(8081);


io.sockets.on('connection', function (socket) {
    socket.on('move', function(options){
        console.log(options);
        servo.move(options.val);
    });
});

board = new five.Board();

board.on("ready", function() {

  servo = new five.Servo({
        pin: 9
  });

  // Inject the `sensor` hardware into
  // the Repl instance's context;
  // allows direct command line access

  board.repl.inject({
  //   pot: potentiometer,
       b: board,
       s: servo
  //   f: five
  });

});


