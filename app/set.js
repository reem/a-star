var Set = {};

(function (exports) {
  var Set = function (keys) {
    this._storage = {};
    if (keys) {
      _.each(keys, function (key) {
        this._storage[key] = true;
      });
    }
  };

  Set.prototype.insert = function (key) {
    this._storage[key] = true;
  };

  Set.prototype.remove = function (key) {
    delete this._storage[key];
  };

  Set.prototype.contains = function (key) {
    return (key in this._storage);
  };

  Set.prototype.intersection = function (other) {
    return this.filter(other.contains.bind(other));
  };

  Set.prototype.difference = function (other) {
    return this.filter(Utility.not(other.contains.bind(other)));
  };

  Set.prototype.each = function (callback, context) {
    _.each(this.toList, callback, context);
  };

  Set.prototype.filter = function (predicate, context) {
    return new Set(_.filter(this.toList, predicate, context));
  };

  Set.prototype.toList = function () {
    return Object.keys(this._storage);
  };

  Set.prototype.length = function () {
    return this.toList.length;
  };
}(Set));