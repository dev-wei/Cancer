(function (exports) {
  exports.forEach = function (arr, eachFn, doneFn) {
    var i = 0;
    var len = arr.length >>> 0;

    var next = function (result) {
      var async;
      var abort = result === false;

      do {
        i++
      } while (!(i in arr) && i !== len);

      if (abort || i === len) {
        if (doneFn) {
          doneFn(!abort, arr);
        }
        return;
      }

      result = eachFn.call({
        async: function () {
          async = true;
          return next;
        }
      }, arr[i], i, arr);

      if (!async) {
        next(result);
      }
    };

    next();
  };
}(typeof exports === 'object' && exports || this));



