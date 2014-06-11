// ==========================================================================
// Project:   Stik Courier - Messaging system for Stik.js
// Copyright: Copyright 2013-2014 Lukas Alexandre
// License:   Licensed under MIT license
//            See https://github.com/stikjs/stik-courier/blob/master/LICENSE
// ==========================================================================

// Version: 0.2.0 | From: 11-06-2014

window.stik.boundary({
  as: "$courier",
  resolvable: true,
  cache: true,
  to: function courier(){
    var obj = {},
        subscriptions = {};

    obj.receive = function receive( box, opener ){
      var subscription = createSubscription({
        box: stringify( box ), opener: opener
      });

      subscriptions[ box ] = ( subscriptions[ box ] || [] );
      subscriptions[ box ].push( subscription );

      return unsubscribe.bind( {}, subscription );
    };

    obj.send = function send( box, message ){
      var i = 0,
          foundAny = false;

      fetchSubscriptions( box , function( openers ){
        foundAny = true;
        i = openers.length;
        while ( i-- ) {
          openers[ i ].opener( message );
        }
      });

      if ( !foundAny ) { throw "Stik: No receiver registered for '" + box + "'"; }
    };

    obj.reset = function reset() { subscriptions = {}; }

    function fetchSubscriptions( box, callback ){
      var senderPattern = new RegExp( box ),
          receiverPattern;

      for ( var name in subscriptions ) {
        receiverPattern = new RegExp( stringify( name ) )
        if ( senderPattern.exec( stringify( name ) ) ||
             receiverPattern.exec( stringify( box ) ) ) {
          callback( subscriptions[ name ] );
        }
      }
    }

    function unsubscribe( subscription ){
      subscriptions[ subscription.box ] =
      subscriptions[ subscription.box ].filter( function( subs ){
        return subs.id !== subscription.id;
      });

      if ( subscriptions[ subscription.box ].length === 0 ) {
        delete subscriptions[ subscription.box ];
      }
    }

    function createSubscription( spec ){
      spec.id = '#' + Math.floor(
        Math.random()*16777215
      ).toString( 16 );

      return spec;
    }

    function stringify( name ){
      return name.toString()
                 .replace(/(^\/|\/$)/g, "");
    }

    return obj;
  }
});
