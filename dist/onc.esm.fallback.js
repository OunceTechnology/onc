var _rng = Math.random;

function rng() {
  return _rng();
} // Use Fisher–Yates shuffle http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
// see also http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// to get random permutation from a finite set.


function getRandomSubarray(arr, size) {
  var shuffled = [];
  var index = 0;
  var rand;
  arr.forEach(function (value) {
    rand = Math.floor((index++ + 1) * _rng());
    shuffled[index - 1] = shuffled[rand];
    shuffled[rand] = value;
  }); // return the part we want

  return size ? shuffled.slice(0, size) : shuffled;
} // Use Fisher–Yates shuffle http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
// see also http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// to get random permutation from a finite set.


function getRandomSubarrayAlt(arr, size) {
  var shuffled = arr.slice();
  var count = arr.length;
  var rand;
  var temp;

  while (count) {
    rand = _rng() * count-- | 0;
    temp = arr[count];
    arr[count] = arr[rand];
    arr[rand] = temp;
  } // return the part we want


  return size ? shuffled.slice(0, size) : shuffled;
}

function setRng(newrng) {
  _rng = newrng;
}

var shuffle = {
  getRandomSubarray: getRandomSubarray,
  getRandomSubarrayAlt: getRandomSubarrayAlt,
  setRng: setRng,
  rng: rng
};

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

var _now = function (self) {
  return self.performance && self.performance.now ? function () {
    return self.performance.now();
  } : function () {
    return Date.now();
  };
}(typeof self !== 'undefined' ? self : window);

var ElapsedTimer = /*#__PURE__*/function () {
  function ElapsedTimer() {
    _classCallCheck(this, ElapsedTimer);
  }

  _createClass(ElapsedTimer, [{
    key: "start",
    value:
    /**
     * Start the timer
     */
    function start() {
      this.startDate = new Date();
      this.startTime = _now();
    }
    /**
     *
     * @param {Number} precision
     * @returns {Number} Elapsed time (ms) to precision decimal places
     */

  }, {
    key: "elapsed",
    value: function elapsed() {
      var precision = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
      return Number(this.elapsedFull().toFixed(precision));
    }
    /**
     *
     * @returns Elapsed time in ms
     */

  }, {
    key: "elapsedFull",
    value: function elapsedFull() {
      return _now() - this.startTime;
    }
  }]);

  return ElapsedTimer;
}();

var _gcd = function _gcd(a, b) {
  while (b != 0) {
    var _ref = [b, a % b];
    a = _ref[0];
    b = _ref[1];
  }

  return Math.abs(a);
};

var lcm = (function (a, b) {
  return a / _gcd(a, b) * b;
});

var propertyMap$1 = new WeakMap();
var BITS_PER_BYTE$1 = 8;

var CharSet = /*#__PURE__*/function () {
  function CharSet(chars) {
    _classCallCheck(this, CharSet);

    if (!(typeof chars === 'string' || chars instanceof String)) {
      throw new TypeError('Invalid chars: Must be string');
    }

    var length = chars.length;

    if (![2, 4, 8, 16, 32, 64].includes(length)) {
      throw new Error('Invalid char count: must be one of 2,4,8,16,32,64');
    }

    var bitsPerChar = Math.floor(Math.log2(length)); // Ensure no repeated characters

    for (var index = 0; index < length; index++) {
      var c = chars.charAt(index);

      for (var index_ = index + 1; index_ < length; index_++) {
        if (c === chars.charAt(index_)) {
          throw new Error('Characters not unique');
        }
      }
    }

    var privProps = {
      chars: chars,
      bitsPerChar: bitsPerChar,
      length: length,
      ndxFn: _ndxFunction(bitsPerChar),
      charsPerChunk: lcm(bitsPerChar, BITS_PER_BYTE$1) / bitsPerChar
    };
    propertyMap$1.set(this, privProps);
  }

  _createClass(CharSet, [{
    key: "getChars",
    value: function getChars() {
      return propertyMap$1.get(this).chars;
    }
  }, {
    key: "getBitsPerChar",
    value: function getBitsPerChar() {
      return propertyMap$1.get(this).bitsPerChar;
    }
  }, {
    key: "getNdxFn",
    value: function getNdxFn() {
      return propertyMap$1.get(this).ndxFn;
    }
  }, {
    key: "getCharsPerChunk",
    value: function getCharsPerChunk() {
      return propertyMap$1.get(this).charsPerChunk;
    }
  }, {
    key: "length",
    value: function length() {
      return propertyMap$1.get(this).length;
    }
  }, {
    key: "bytesNeeded",
    value: function bytesNeeded(entropyBits) {
      var count = Math.ceil(entropyBits / this.bitsPerChar());
      return Math.ceil(count * this.bitsPerChar() / BITS_PER_BYTE$1);
    } // Aliases

  }, {
    key: "chars",
    value: function chars() {
      return this.getChars();
    }
  }, {
    key: "ndxFn",
    value: function ndxFn() {
      return this.getNdxFn();
    }
  }, {
    key: "bitsPerChar",
    value: function bitsPerChar() {
      return this.getBitsPerChar();
    }
  }]);

  return CharSet;
}();

var _ndxFunction = function _ndxFunction(bitsPerChar) {
  // If BITS_PER_BYTEs is a multiple of bitsPerChar, we can slice off an integer number
  // of chars per byte.
  if (lcm(bitsPerChar, BITS_PER_BYTE$1) === BITS_PER_BYTE$1) {
    return function (chunk, slice, bytes) {
      var lShift = bitsPerChar;
      var rShift = BITS_PER_BYTE$1 - bitsPerChar;
      return (bytes[chunk] << lShift * slice & 0xff) >> rShift;
    };
  } // Otherwise, while slicing off bits per char, we will possibly straddle a couple
  // of bytes, so a bit more work is involved


  var slicesPerChunk = lcm(bitsPerChar, BITS_PER_BYTE$1) / BITS_PER_BYTE$1;
  return function (chunk, slice, bytes) {
    var bNumber = chunk * slicesPerChunk;
    var offset = slice * bitsPerChar / BITS_PER_BYTE$1;
    var lOffset = Math.floor(offset);
    var rOffset = Math.ceil(offset);
    var rShift = BITS_PER_BYTE$1 - bitsPerChar;
    var lShift = slice * bitsPerChar % BITS_PER_BYTE$1;
    var ndx = (bytes[bNumber + lOffset] << lShift & 0xff) >> rShift;
    var rShiftIt = ((rOffset + 1) * BITS_PER_BYTE$1 - (slice + 1) * bitsPerChar) % BITS_PER_BYTE$1;

    if (rShift < rShiftIt) {
      ndx += bytes[bNumber + rOffset] >> rShiftIt;
    }

    return ndx;
  };
};

var charSet64 = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_');
var charSet32 = new CharSet('2346789bdfghjmnpqrtBDFGHJLMNPQRT');
var charSet16 = new CharSet('0123456789abcdef');
var charSet8 = new CharSet('01234567');
var charSet4 = new CharSet('ATCG');
var charSet2 = new CharSet('01');

var _log2 = Math.log2;

var _totalOf = function _totalOf(numberStrings, log2Risk) {
  if (numberStrings == 0) {
    return 0;
  }

  var N = numberStrings < 1000 ? _log2(numberStrings) + _log2(numberStrings - 1) : 2 * _log2(numberStrings);
  return N + log2Risk - 1;
};

var bits = function bits(total, risk) {
  if (total == 0) {
    return 0;
  }

  return _totalOf(total, _log2(risk));
};

var Entropy = {
  bits: bits
};

var propertyMap = new WeakMap();
var BITS_PER_BYTE = 8;

var _default = /*#__PURE__*/function () {
  function _default(argument) {
    _classCallCheck(this, _default);

    var charSet;

    if (argument === undefined) {
      charSet = charSet32;
    } else if (argument instanceof CharSet) {
      charSet = argument;
    } else if (typeof argument === 'string' || argument instanceof String) {
      charSet = new CharSet(argument);
    } else {
      throw new TypeError('Invalid arg: must be either valid CharSet or valid chars');
    }

    var hideProps = {
      charSet: charSet
    };
    propertyMap.set(this, hideProps);
  }

  _createClass(_default, [{
    key: "smallID",
    value: function smallID() {
      var charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propertyMap.get(this).charSet;
      return this.string(29, charSet);
    }
  }, {
    key: "mediumID",
    value: function mediumID() {
      var charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propertyMap.get(this).charSet;
      return this.string(69, charSet);
    }
  }, {
    key: "largeID",
    value: function largeID() {
      var charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propertyMap.get(this).charSet;
      return this.string(99, charSet);
    }
  }, {
    key: "sessionID",
    value: function sessionID() {
      var charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propertyMap.get(this).charSet;
      return this.string(128, charSet);
    }
  }, {
    key: "token",
    value: function token() {
      var charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propertyMap.get(this).charSet;
      return this.string(256, charSet);
    }
  }, {
    key: "string",
    value: function string(entropyBits) {
      var charSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propertyMap.get(this).charSet;
      var bytesNeeded = charSet.bytesNeeded(entropyBits);
      return this.stringWithBytes(entropyBits, _cryptoBytes(bytesNeeded), charSet);
    }
  }, {
    key: "stringRandom",
    value: function stringRandom(entropyBits) {
      var charSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propertyMap.get(this).charSet;
      var bytesNeeded = charSet.bytesNeeded(entropyBits);
      return this.stringWithBytes(entropyBits, _randomBytes(bytesNeeded), charSet);
    }
  }, {
    key: "stringWithBytes",
    value: function stringWithBytes(entropyBits, bytes) {
      var charSet = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : propertyMap.get(this).charSet;
      return _stringWithBytes(entropyBits, bytes, charSet);
    }
  }, {
    key: "bytesNeeded",
    value: function bytesNeeded(entropyBits) {
      var charSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propertyMap.get(this).charSet;
      return charSet.bytesNeeded(entropyBits);
    }
  }, {
    key: "chars",
    value: function chars() {
      return propertyMap.get(this).charSet.chars();
    }
  }, {
    key: "use",
    value: function use(charSet) {
      if (!(charSet instanceof CharSet)) {
        throw new TypeError('Invalid CharSet');
      }

      propertyMap.get(this).charSet = charSet;
    }
  }, {
    key: "useChars",
    value: function useChars(chars) {
      if (!(typeof chars === 'string' || chars instanceof String)) {
        throw new TypeError('Invalid chars: Must be string');
      }

      this.use(new CharSet(chars));
    }
  }]);

  return _default;
}();

var _stringWithBytes = function _stringWithBytes(entropyBits, bytes, charSet) {
  if (entropyBits <= 0) {
    return '';
  }

  var bitsPerChar = charSet.getBitsPerChar();
  var count = Math.ceil(entropyBits / bitsPerChar);

  if (count <= 0) {
    return '';
  }

  var need = Math.ceil(count * (bitsPerChar / BITS_PER_BYTE));

  if (bytes.length < need) {
    throw new Error('Insufficient bytes: need ' + need + ' and got ' + bytes.length);
  }

  var charsPerChunk = charSet.getCharsPerChunk();
  var chunks = Math.floor(count / charsPerChunk);
  var partials = count % charsPerChunk;
  var ndxFunction = charSet.getNdxFn();
  var chars = charSet.getChars();
  var string = '';

  for (var chunk = 0; chunk < chunks; chunk++) {
    for (var slice = 0; slice < charsPerChunk; slice++) {
      var ndx = ndxFunction(chunk, slice, bytes);
      string += chars[ndx];
    }
  }

  for (var _slice = 0; _slice < partials; _slice++) {
    var _ndx = ndxFunction(chunks, _slice, bytes);

    string += chars[_ndx];
  }

  return string;
};

var _cryptoBytes = function _cryptoBytes(count) {
  var buffer = new Uint8Array(count);
  window.crypto.getRandomValues(buffer);
  return buffer;
};

var _randomBytes = function _randomBytes(count) {
  var BYTES_USED_PER_RANDOM_CALL = 6;
  var randCount = Math.ceil(count / BYTES_USED_PER_RANDOM_CALL);
  var buffer = new Uint8Array(count);
  var dataView = new DataView(new ArrayBuffer(BITS_PER_BYTE));

  for (var rNumber = 0; rNumber < randCount; rNumber++) {
    dataView.setFloat64(0, Math.random());

    for (var n = 0; n < BYTES_USED_PER_RANDOM_CALL; n++) {
      var fByteNumber = _endianByteNumber[n];
      var bByteNumber = rNumber * BYTES_USED_PER_RANDOM_CALL + n;

      if (bByteNumber < count) {
        buffer[bByteNumber] = dataView.getUint8(fByteNumber);
      }
    }
  }

  return buffer;
};

var _endianByteNumber = function () {
  var buf32 = new Uint32Array(1);
  var buf8 = new Uint8Array(buf32.buffer);
  buf32[0] = 0xff;
  return buf8[0] === 0xff ? [2, 3, 4, 5, 6, 7] : [0, 1, 2, 3, 6, 7];
}();

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  CharSet: CharSet,
  charSet16: charSet16,
  charSet2: charSet2,
  charSet32: charSet32,
  charSet4: charSet4,
  charSet64: charSet64,
  charSet8: charSet8,
  Entropy: Entropy,
  Random: _default
});

var increment$1 = 0;
var pid$1 = Math.floor(Math.random() * 32767);
var machine$1 = Math.floor(Math.random() * 16777216); // eslint-disable-next-line unicorn/no-document-cookie

document.cookie = "mongoMachineId=;expires=".concat(new Date().toUTCString(), ";path=/;domain=").concat(location.hostname);

if (typeof localStorage !== 'undefined') {
  localStorage.removeItem('mongoMachineId');
} // if (typeof localStorage !== 'undefined') {
//   const mongoMachineId = parseInt(localStorage.mongoMachineId);
//   if (mongoMachineId >= 0 && mongoMachineId <= 16777215) {
//     machine = Math.floor(localStorage.mongoMachineId);
//   }
//   // Just always stick the value in.
//   localStorage.mongoMachineId = machine;
//   document.cookie = `mongoMachineId=${machine};expires=Tue, 19 Jan 2038 05:00:00 GMT`;
// } else {
//   const cookieList = document.cookie.split('; ');
//   for (const cookie of cookieList) {
//     const parts = cookie.split('=');
//     if (parts[0] === 'mongoMachineId' && Number(parts[1]) >= 0 && Number(parts[1]) <= 16777215) {
//       machine = Number(parts[1]);
//       break;
//     }
//   }
//   document.cookie = `mongoMachineId=${machine};expires=Tue, 19 Jan 2038 05:00:00 GMT`;
// }


var ID = {
  // private timestamp: any
  // private machine: number
  // private pid: number
  // private increment: number
  setup: function setup() {
    for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
      arguments_[_key] = arguments[_key];
    }

    var a0 = arguments_[0];

    if (_typeof(a0) === 'object') {
      this.timestamp = a0.timestamp;
      this.machine = a0.machine;
      this.pid = a0.pid;
      this.increment = a0.increment;
    } else if (typeof a0 === 'string' && a0.length === 24) {
      this.timestamp = Number("0x".concat(a0.slice(0, 8)));
      this.machine = Number("0x".concat(a0.slice(8, 14)));
      this.pid = Number("0x".concat(a0.slice(14, 18)));
      this.increment = Number("0x".concat(a0.slice(18, 24)));
    } else if (arguments.length === 4 && a0 !== null) {
      this.timestamp = a0;
      this.machine = arguments_[1];
      this.pid = arguments_[2];
      this.increment = arguments_[3];
    } else {
      this.timestamp = Math.floor(Date.now() / 1000);
      this.machine = machine$1;
      this.pid = pid$1;
      this.increment = increment$1++;

      if (increment$1 > 0xffffff) {
        increment$1 = 0;
      }
    }

    return this;
  },
  getDate: function getDate() {
    return new Date(this.timestamp * 1000);
  },
  toArray: function toArray() {
    var stringOid = this.toString();
    var array = [];
    var index;

    for (index = 0; index < 12; index++) {
      array[index] = Number.parseInt(stringOid.slice(index * 2, index * 2 + 2), 16);
    }

    return array;
  },
  toString: function toString() {
    var timestamp = this.timestamp.toString(16);
    var mach = this.machine.toString(16);
    var pd = this.pid.toString(16);
    var incr = this.increment.toString(16);
    return '00000000'.slice(0, Math.max(0, 8 - timestamp.length)) + timestamp + '000000'.slice(0, Math.max(0, 6 - mach.length)) + mach + '0000'.slice(0, Math.max(0, 4 - pd.length)) + pd + '000000'.slice(0, Math.max(0, 6 - incr.length)) + incr;
  }
};

var objectID = function objectID(arguments_) {
  return Object.create(ID).setup(arguments_);
};

var _instance;

var _random = {
  setup: function setup() {
    var total = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1e6;
    var risk = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1e9;
    this.random = new _default();
    this.bits = Entropy.bits(total, risk);
    return this;
  },
  string: function string() {
    return this.random.string(this.bits);
  }
};
function init(total, risk) {
  _instance = Object.create(_random).setup(total, risk);
}
/**
 *
 * @returns {string} A random string
 */

function string() {
  if (!_instance) {
    init();
  }

  return _instance.string();
}

var randomString = /*#__PURE__*/Object.freeze({
  __proto__: null,
  init: init,
  string: string
});

var RBAC = {
  init: function init(roles) {
    // If not a function then should be object
    if (_typeof(roles) !== 'object') {
      throw new TypeError('Expected input to be function or object');
    } // eslint-disable-next-line unicorn/no-array-reduce


    var map = Object.keys(roles).reduce(function (map, role) {
      map[role] = {
        can: {}
      }; // Check can definition

      if (!Array.isArray(roles[role].can)) {
        throw new TypeError("Expected roles[".concat(role, "].can to be an array"));
      }

      if (roles[role].inherits) {
        if (!Array.isArray(roles[role].inherits)) {
          throw new TypeError("Expected roles[".concat(role, "].inherits to be an array"));
        }

        map[role].inherits = [];

        var _iterator = _createForOfIteratorHelper(roles[role].inherits),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var child = _step.value;

            if (typeof child !== 'string') {
              throw new TypeError("Expected roles[".concat(role, "].inherits element"));
            }

            if (!roles[child]) {
              throw new TypeError("Undefined inheritance role: ".concat(child));
            }

            map[role].inherits.push(child);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      } // Iterate allowed operations


      var _iterator2 = _createForOfIteratorHelper(roles[role].can),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var operation = _step2.value;

          // If operation is string
          if (typeof operation === 'string') {
            // Add as an operation
            map[role].can[operation] = 1;
            continue;
          } // Check if operation has a .when function


          if (typeof operation.when === 'function' && typeof operation.name === 'string') {
            map[role].can[operation.name] = operation.when;
            continue;
          }

          throw new TypeError("Unexpected operation type ".concat(operation));
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return map;
    }, {}); // Add roles to class and mark as inited

    this.roles = map;
    this._inited = true;
    return this;
  },
  canSync: function canSync(role, operation, parameters) {
    var _this = this;

    // If not inited then wait until init finishes
    if (!this._inited) {
      return this._init.then(function () {
        return _this.can(role, operation, parameters);
      });
    }

    if (typeof role !== 'string') {
      throw new TypeError('Expected first parameter to be string : role');
    }

    if (typeof operation !== 'string') {
      throw new TypeError('Expected second parameter to be string : operation');
    }

    var $role = this.roles[role];

    if (!$role) {
      throw new Error('Undefined role');
    } // IF this operation is not defined at current level try higher


    if (!$role.can[operation]) {
      // If no parents reject
      if (!$role.inherits || $role.inherits.length === 0) {
        return false;
      } // Return if any parent resolves true or all reject


      return $role.inherits.some(function (parent) {
        return _this.canSync(parent, operation, parameters);
      });
    } // We have the operation resolve


    if ($role.can[operation] === 1) {
      return true;
    } // Operation is conditional, run async function


    if (typeof $role.can[operation] === 'function') {
      $role.can[operation](parameters, function (error, result) {
        if (error) {
          return false;
        }

        if (!result) {
          return false;
        }

        return true;
      });
      return;
    } // No operation reject as false


    return false;
  },
  can: function can(role, operation, parameters) {
    var _this2 = this;

    // If not inited then wait until init finishes
    if (!this._inited) {
      return this._init.then(function () {
        return _this2.can(role, operation, parameters);
      });
    }

    return new Promise(function (resolve, reject) {
      if (typeof role !== 'string') {
        throw new TypeError('Expected first parameter to be string : role');
      }

      if (typeof operation !== 'string') {
        throw new TypeError('Expected second parameter to be string : operation');
      }

      var $role = _this2.roles[role];

      if (!$role) {
        throw new Error('Undefined role');
      } // IF this operation is not defined at current level try higher


      if (!$role.can[operation]) {
        // If no parents reject
        if (!$role.inherits || $role.inherits.length === 0) {
          return reject(new Error('unauthorized'));
        } // Return if any parent resolves true or all reject


        return Promise.all($role.inherits.map(function (parent) {
          return _this2.can(parent, operation, parameters).then(function () {
            return true;
          }).catch(function () {
            return false;
          });
        })).then(function (result) {
          if (result.some(Boolean)) {
            resolve();
          } else {
            reject();
          }
        });
      } // We have the operation resolve


      if ($role.can[operation] === 1) {
        return resolve(true);
      } // Operation is conditional, run async function


      if (typeof $role.can[operation] === 'function') {
        $role.can[operation](parameters, function (error, result) {
          if (error) {
            return reject(error);
          }

          if (!result) {
            return reject(new Error('unauthorized'));
          }

          resolve(true);
        });
        return;
      } // No operation reject as false


      reject(false);
    });
  }
};

var increment = 0;
var pid = Math.floor(Math.random() * 32767);
var machine = Math.floor(Math.random() * 16777216); // if (typeof localStorage !== 'undefined') {
//   let mongoMachineId = parseInt(localStorage.mongoMachineId);
//   if (mongoMachineId >= 0 && mongoMachineId <= 16777215) {
//     machine = Math.floor(localStorage.mongoMachineId);
//   }
//   // Just always stick the value in.
//   localStorage.mongoMachineId = machine;
//   document.cookie = `mongoMachineId=${machine};expires=Tue, 19 Jan 2038 05:00:00 GMT`;
// } else {
//   let cookieList = document.cookie.split('; ');
//   for (let i in cookieList) {
//     let cookie = cookieList[i].split('=');
//     if (cookie[0] === 'mongoMachineId' && Number(cookie[1]) >= 0 && Number(cookie[1]) <= 16777215) {
//       machine = Number(cookie[1]);
//       break;
//     }
//   }
//   document.cookie = `mongoMachineId=${machine};expires=Tue, 19 Jan 2038 05:00:00 GMT`;
// }

var ObjectId = {
  // private timestamp: any
  // private machine: number
  // private pid: number
  // private increment: number
  setup: function setup() {
    for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
      arguments_[_key] = arguments[_key];
    }

    var a0 = arguments_[0];

    if (_typeof(a0) === 'object') {
      this.timestamp = a0.timestamp;
      this.machine = a0.machine;
      this.pid = a0.pid;
      this.increment = a0.increment;
    } else if (typeof a0 === 'string' && a0.length === 24) {
      this.timestamp = Number("0x".concat(a0.slice(0, 8)));
      this.machine = Number("0x".concat(a0.slice(8, 14)));
      this.pid = Number("0x".concat(a0.slice(14, 18)));
      this.increment = Number("0x".concat(a0.slice(18, 24)));
    } else if (arguments.length === 4 && a0 !== null) {
      this.timestamp = a0;
      this.machine = arguments_[1];
      this.pid = arguments_[2];
      this.increment = arguments_[3];
    } else {
      this.timestamp = Math.floor(Date.now() / 1000);
      this.machine = machine;
      this.pid = pid;
      this.increment = increment++;

      if (increment > 0xffffff) {
        increment = 0;
      }
    }

    return this;
  },
  getDate: function getDate() {
    return new Date(this.timestamp * 1000);
  },
  toArray: function toArray() {
    var stringOid = this.toString();
    var array = [];
    var index;

    for (index = 0; index < 12; index++) {
      array[index] = Number.parseInt(stringOid.slice(index * 2, index * 2 + 2), 16);
    }

    return array;
  },
  toString: function toString() {
    var timestamp = this.timestamp.toString(16);
    var mach = this.machine.toString(16);
    var pd = this.pid.toString(16);
    var incr = this.increment.toString(16);
    return '00000000'.slice(0, Math.max(0, 8 - timestamp.length)) + timestamp + '000000'.slice(0, Math.max(0, 6 - mach.length)) + mach + '0000'.slice(0, Math.max(0, 4 - pd.length)) + pd + '000000'.slice(0, Math.max(0, 6 - incr.length)) + incr;
  }
};

var objectId = function objectId(arguments_) {
  return Object.create(ObjectId).setup(arguments_);
};

export { ElapsedTimer, index as EntropyString, RBAC, randomString as RandomString, getRandomSubarray, getRandomSubarrayAlt, objectID, rng, setRng, shuffle, objectId as uniqueId };
//# sourceMappingURL=onc.esm.fallback.js.map
