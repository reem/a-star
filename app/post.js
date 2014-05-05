/* globals _ */
var Post = {};

(function (exports) {
  var Event = function (name, value) {
    this.name = name;
    this.value = value;
  };

  var EventManager = function (wait) {
    this.registered = {};
    this.queue = new Queue.Queue();
    this.wait = waitTime;
  };

  EventManager.prototype.init = function() {
    this.timerID = setInterval(function () {
      if (queue.length !== 0) {
        this.unsafeFire(this.queue.dequeue());
      }
    }, this.wait);
  };

  EventManager.prototype.post = function (name, value) {
    this.queue.enqueue(new Event(name, value));
  };

  EventManager.prototype.register = function (name, callback) {
    if (name in this.registered)
      this.registered[name].push(callback);
    else
      this.registered[name] = [callback];
  };

  EventManager.prototype.end = function() {
    clearInterval(this.timerID);
  };

  EventManager.prototype.setWaitTime = function (newTime) {
    this.end();
    this.wait = newTime;
    this.init();
  };

  EventManager.prototype.unsafeFire = function (event) {
    // Fires an event immediately, circumventing the queue.
    _.each(this.registered[event.name], function (callback) {
      callback(event.value);
    });

    _.each(this.registered.all, function (callback) {
      callback(event.name, event.value);
    });
  };

  exports.EventManager = EventManager;
}(Post));
