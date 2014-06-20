#$courier

[![Build Status](https://travis-ci.org/stikjs/stik-courier.svg?branch=master)](https://travis-ci.org/stikjs/stik-courier)

Enables a controller/behavior to send and receive messages from another controller/behavior.

##Using it
```javascript
stik.controller("MessageCtrl", "Sender", function($courier){
  // delegate a new message to the controller responsible for it
  // can be either a String or a JS Object (POJO)
  $courier.send("new-message", {
    your: "delegation"
  });

  // to avoid execption while sending messages with
  // not yet defined receivers set throwOnMissing: false
  $courier.send("new-message", {
    your: "delegation"
  }, {throwOnMissing: false});
});

stik.controller("MessageCtrl", "Receiver", function($courier){
  // specify what messages this controller should expect
  $courier.receive("new-message", function(msg){
    // do something with the message
    ...
  });
  // a message can be delivered to any number of controllers that
  // defines an expectation for it
});

stik.controller("MessageCtrl", "OneTimeReceiver", function($courier){
  // sometimes a controller needs to receive a message just once
  // the $receive method returns another method that can be called
  // to `unsubscribe` to further messages
  var unsubscribe = $courier.receive("new-message", function(msg){
    ...
    unsubscribe();
    // this receiver will never again be called
  });
});
```
