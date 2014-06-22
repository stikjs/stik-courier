// ==========================================================================

// Project:   Stik Courier - Messaging system for Stik.js

// Copyright: Copyright 2013-2014 Lukas Alexandre

// License:   Licensed under MIT license

//            See https://github.com/stikjs/stik-courier/blob/master/LICENSE

// ==========================================================================


// Version: 0.3.0 | From: 22-6-2014

(function(stik, Courier){
  stik.boundary({
    as: "$courier",
    cache: true,
    to: new Courier()
  });
})(window.stik, window.Courier);
