var Utility = {};

(function (exports) {
  exports.not = function (func, context) {
    return function () {
      return !(func.apply(context, arguments));
    };
  };
}(Utility));