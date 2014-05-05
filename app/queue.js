var Queue = {};

(function (exports) {
  var Queue = function () {
    this.storage = {};
    this.low = 0;
    this.high = 0;
  };

  Queue.fromArray = function (arr) {
    _.each(arr, this.insert.bind(this));
  };

  Queue.prototype.enqueue = function (val) {
    this.storage[this.high++] = val;
  };

  Queue.prototype.dequeue = function () {
    var result = this.storage[this.low];
    delete this.storage[this.low++];
    return result;
  };

  Queue.prototype.length = function() {
    return this.high - this.low;
  };

  Queue.prototype.peek = function () {
    return this.storage[this.low];
  };

  exports.Queue = Queue;
}(Queue));