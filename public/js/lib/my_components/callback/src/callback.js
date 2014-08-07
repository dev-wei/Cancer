/***
 *
 */
var Callback = (function (options) {
    'use strict';

    if (typeof options.func !== 'function') {
        throw 'Callback created without a func.';
    }

    // Private methods
    var marshalToFunction = function (value) {
        if (typeof value !== 'function') {
            return function () {
                return value;
            };
        } else {
            return value;
        }
    };

    options.must_keep = marshalToFunction(options.must_keep || false);

    // Privileged methods
    return {
        func: function () {
            return options.func.apply(options, arguments);
        },
        must_keep: function () {
            return options.must_keep.apply(options, arguments);
        }
    };
});

/***
 *
 */
var CallbackList = (function () {
    'use strict';

    // Private class level objects
    var mergeOptions = function (obj1, obj2) {
        obj1 = obj1 || {};
        obj2 = obj2 || {};
        var obj3 = {};
        for (var attr1 in obj1) {
            if (obj1.hasOwnProperty(attr1)) {
                obj3[attr1] = obj1[attr1];
            }
        }
        for (var attr2 in obj2) {
            if (obj2.hasOwnProperty(attr2)) {
                obj3[attr2] = obj2[attr2];
            }
        }
        return obj3;
    };

    var makeArray = function (callbacks) {
        if (!(callbacks instanceof Array)) {
            callbacks = [callbacks];
        }
        return callbacks;
    };

    var marshal = function (c) {
        if (c instanceof Callback) {
            return c;
        } else {
            return new Callback({
                func: c,
                must_keep: mustKeep()
            });
        }
    };

    var marshalArray = function (callbacks) {
        var results = [];
        for (var c in callbacks) {
            if (callbacks.hasOwnProperty(c)) {
                var marshalled = marshal(callbacks[c]);
                results = results.concat(marshalled);
            }
        }

        return results;
    };

    var mustKeep = function () {
        if (arguments.length > 0) {
            options.must_keep = arguments[0];
        }
        return options.must_keep;
    };

    var size = function () {
        return list.length;
    };

    var add = function (callbacks) {
        // Make sure callbacks is always an array
        callbacks = makeArray(callbacks);

        // Make sure callbacks are Callback
        callbacks = marshalArray(callbacks);

        // Add them
        list = list.concat.apply(list, callbacks);
        return callbacks;
    };

    var clear = function () {
        list = [];
    };

    var handle = function (isSuccess) {
        // Scan list in reverse order so we can delete elements
        // without causing problems
        var args = Array.prototype.slice.call(arguments);
        for (var i = list.length - 1; i >= 0; i--) {
            // Call handle on each callback
            list[i].func.apply(this, args);
            // Check if it should be kept
            var keep = list[i].must_keep(this, args);
            if (!keep) {
                list.splice(i, 1);
            }
        }
    };

    // Private variables
    var defaults = {
        must_keep: false
    };

    var opts;
    if (arguments.length > 0) {
        var possibility = arguments[arguments.length - 1];
        if (possibility.constructor === Object) {
            // Bare object, must be our options
            opts = possibility;
        }
    } else {
        opts = {};
    }

    var options = mergeOptions(defaults, opts);
    var list;

    // Initialize list
    clear();

    // Add callbacks if any specified on creation
    if (arguments.length > 0 && arguments[0].constructor !== Object) {
        this.add(arguments[0]);
    }

    return {
        size: size,
        add: add,
        clear: clear,
        handle: handle
    };
});

// Export the Underscore object for **Node.js**, with
// backwards-compatibility for the old `require()` API. If we're in
// the browser, add `_` as a global object via a string identifier,
// for Closure Compiler "advanced" mode.
if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = CallbackList;
    }
}





