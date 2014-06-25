GLOBAL.window = {};

require("stik-core");
require("stik-labs");
require("courier.js");
require("../src/boundary");

describe("stik-courier", function(){
  it("should return an instance of Courier", function(){
    var courier = window.stik.labs.boundary({
      name: "$courier"
    }).run();

    expect(courier instanceof window.Courier).toBeTruthy();
  });
});
