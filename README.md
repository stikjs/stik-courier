#$courier

[![Build Status](https://travis-ci.org/stikjs/stik-courier.svg?branch=master)](https://travis-ci.org/stikjs/stik-courier)

Enables a controller/behavior to send and receive messages from another controller/behavior. It uses [courier.js](https://github.com/lukelex/courier.js) under the hood.

##Using it
```javascript
stik.controller("MessageCtrl", "Sender", function($courier){
  // delegate a new message to the controller responsible for it
  // can be either a String or a JS Object (POJO)
  $courier.send("new-message", {
    your: "delegation"
  });

  // to avoid an exeception while sending messages to
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

##Installing

If you use NPM (you should) just do:

```bash
$ npm install --save stik-courier
```

Otherwise, just download and and add the file to your page. If you're already using `courier.js` then you only need the `./dist/stik-courier(.min).js` file. If not, then use the `./dist/stik-courier-full(.min).js`
