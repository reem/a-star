var Utility = {};

(function (exports) {
  exports.not = function (func, context) {
    return function () {
      return !(func.apply(context, arguments));
    };
  };
  
  exports.wrapNode = function (node) {
    return {
      node: node,
      parent: null,
      visited: false,
      current: false,
    };
  };

  exports.deepCopy = clone;
}(Utility));
