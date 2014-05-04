/* globals _ */
var Post = {};

(function (exports) {
  var registered = {};

  var register = function (name, callback) {
    if (name in registered) {
      registered[name].push(callback);
    } else {
      registered[name] = [callback];
    }
  };

  var post = function (name, value) {
    return reverseMap(registered[name], value);
  };

  var reverseMap = function (funcList, val) {
    return _.map(funcList, function (func) {
      return func(val);
    });
  };

  exports.post = post;
  exports.register = register;
}(Post));
