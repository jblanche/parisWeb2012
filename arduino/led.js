var twitter = require('ntwitter'),
    events = require('events'),
    config = require('./config').config,
    five = require("johnny-five"),
    board = new five.Board();

var twit = new twitter(config.twitter);

twit.stream('statuses/filter', {'track':'parisweb'}, function(stream) {
  stream.on('data', function (data) {
    board.emit('tweet');
  });
});

board.on("ready", function() {
    var led = (new five.Led(8));

    board.on('tweet', function(){
        if(led.value) return ;
        led.on();
        setTimeout(function () {
            led.off();
        }, 1000);
    });
});
