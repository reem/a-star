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
    this._storage[key] = key;
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

  Set.prototype.merge = function (other) {
    this.intersection(other).each(this.insert.bind(this));
  };

  Set.prototype.each = function (callback, context) {
    _.each(this.toList(), callback, context);
  };

  Set.prototype.filter = function (predicate, context) {
    return new Set(_.filter(this.toList, predicate, context));
  };

  var objectValues = function (o) {
    return _.map(Object.keys(o), function (key) {
      return o[key];
    });
  };

  Set.prototype.toList = function () {
    return objectValues(this._storage);
  };

  Set.prototype.length = function () {
    return this.toList.length;
  };

  exports.Set = Set;
}(Set));