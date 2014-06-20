describe("Courier", function(){
  beforeEach(function(){
    stik.labs.boundary({
      name: "$courier"
    }).run().reset();
  });

  describe("#$receive", function(){
    it("should be able to send to one box", function(){
      var courier,
          box = "create-item",
          opener = jasmine.createSpy('createBoxOpener');

      courier = stik.labs.boundary({
        name: "$courier"
      }).run();

      courier.receive(box, opener);

      expect(opener).not.toHaveBeenCalled();

      courier.send(box);
      expect(opener).toHaveBeenCalled();
    });

    it("should be able to send to multiple boxes", function(){
      var courier,
          createBox = "create-item",
          updateBox = "updated-item",
          createBoxOpener = jasmine.createSpy('createBoxOpener'),
          updateBoxOpener = jasmine.createSpy('updateBoxOpener');

      courier = stik.labs.boundary({
        name: "$courier"
      }).run();

      courier.receive(createBox, createBoxOpener);
      courier.receive(updateBox, updateBoxOpener);

      expect(createBoxOpener).not.toHaveBeenCalled();
      expect(updateBoxOpener).not.toHaveBeenCalled();

      courier.send(createBox);
      expect(createBoxOpener).toHaveBeenCalled();
      expect(updateBoxOpener).not.toHaveBeenCalled();

      courier.send(updateBox);
      expect(updateBoxOpener).toHaveBeenCalled();
    });

    it("should return a function to allow removing the receiver", function(){
      var courier,
          box = "missing-message",
          unsubscribe;

      courier = stik.labs.boundary({
        name: "$courier"
      }).run();

      unsubscribe = courier.receive(box, function(){});
      unsubscribe();

      expect(function(){
        courier.send(box, {});
      }).toThrow("Stik: No receiver registered for 'missing-message'");
    });

    it("while unsubscribing should maintain the other boxes intact", function(){
      var courier,
          newItemBox = "new-item",
          changeItemBox = "change-item",
          changeItemOpener = jasmine.createSpy("opener"),
          newItemUnsubscribe, changeItemUnsubscribe;

      courier = stik.labs.boundary({
        name: "$courier"
      }).run();

      newItemUnsubscribe = courier.receive(newItemBox, function(){});
      changeItemUnsubscribe = courier.receive(changeItemBox, changeItemOpener);

      newItemUnsubscribe();

      expect(function(){
        courier.send(newItemBox, {});
      }).toThrow("Stik: No receiver registered for 'new-item'");

      expect(changeItemOpener).not.toHaveBeenCalled();

      expect(function(){
        courier.send(changeItemBox, {});
      }).not.toThrow();

      expect(changeItemOpener).toHaveBeenCalled();
    });
  });

  describe("#send", function(){
    it("should throw if no $receiver is register", function(){
      var courier = stik.labs.boundary({
        name: "$courier"
      }).run();

      expect(function(){
        courier.send('new-item', {});
      }).toThrow("Stik: No receiver registered for 'new-item'");
    });

    it("a text message", function(){
      var courier,
          message = "some message",
          receiver = jasmine.createSpy("receiver");

      courier = stik.labs.boundary({
        name: "$courier"
      }).run();

      courier.receive("new-message", receiver)
      courier.send("new-message", message);

      expect(receiver).toHaveBeenCalledWith(message);
    });

    it("an object message", function(){
      var courier,
          message,
          receiver = jasmine.createSpy("receiver");

      courier = stik.labs.boundary({
        name: "$courier"
      }).run();

      message = {
        some: "super",
        deeply: {
          nested: "message"
        }
      };

      courier.receive("new-message", receiver)
      courier.send("new-message", message);

      expect(receiver).toHaveBeenCalledWith(message);
    });

    it("should be able to wildcard a sender", function(){
      var courier,
          newReceiver = jasmine.createSpy("newReceiver"),
          removedReceiver = jasmine.createSpy("addedReceiver");

      courier = stik.labs.boundary({
        name: "$courier"
      }).run();

      courier.receive("message:new:item", newReceiver);
      courier.receive("message:removed:item", removedReceiver);

      courier.send(/message:.*:item/, {});

      expect(newReceiver).toHaveBeenCalled();
      expect(removedReceiver).toHaveBeenCalled();
    });

    it("should be able to wildcard a receiver", function(){
      var courier,
          receiver = jasmine.createSpy("receiver");

      courier = stik.labs.boundary({
        name: "$courier"
      }).run();

      courier.receive(/message:.*:item/, receiver);

      courier.send("message:new:item", {});
      courier.send("message:updated:item", {});

      expect(receiver.calls.length).toEqual(2);
    });

    it("should not raise when throwOnMissing is false", function(){
      var courier;

      courier = stik.labs.boundary({
        name: "$courier"
      }).run();

      expect(function(){
        courier.send("missing-message", {}, {throwOnMissing: false});
      }).not.toThrow();
    });
  });
});
