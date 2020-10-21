function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
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
  return Constructor;
}

var _now = function (self) {

  return self.performance && self.performance.now ? function () {
    return self.performance.now();
  } : function () {
    return Date.now();
  };
}(typeof self !== 'undefined' ? self : window); // function now() {
//   return _now();
// }


var ElapsedTimer = /*#__PURE__*/function () {
  function ElapsedTimer() {
    _classCallCheck(this, ElapsedTimer);
  }

  _createClass(ElapsedTimer, [{
    key: "start",
    value: function start() {
      this.startDate = new Date();
      this.startTime = _now();
    }
  }, {
    key: "elapsed",
    value: function elapsed(precision) {
      if (precision === undefined) {
        precision = 2;
      }

      return Number((_now() - this.startTime).toFixed(precision));
    }
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

var propMap = new WeakMap();
var BITS_PER_BYTE = 8;

var CharSet = /*#__PURE__*/function () {
  function CharSet(chars) {
    _classCallCheck(this, CharSet);

    if (!(typeof chars === 'string' || chars instanceof String)) {
      throw new Error('Invalid chars: Must be string');
    }

    var length = chars.length;

    if (![2, 4, 8, 16, 32, 64].includes(length)) {
      throw new Error('Invalid char count: must be one of 2,4,8,16,32,64');
    }

    var bitsPerChar = Math.floor(Math.log2(length)); // Ensure no repeated characters

    for (var i = 0; i < length; i++) {
      var c = chars.charAt(i);

      for (var j = i + 1; j < length; j++) {
        if (c === chars.charAt(j)) {
          throw new Error('Characters not unique');
        }
      }
    }

    var privProps = {
      chars: chars,
      bitsPerChar: bitsPerChar,
      length: length,
      ndxFn: _ndxFn(bitsPerChar),
      charsPerChunk: lcm(bitsPerChar, BITS_PER_BYTE) / bitsPerChar
    };
    propMap.set(this, privProps);
  }

  _createClass(CharSet, [{
    key: "getChars",
    value: function getChars() {
      return propMap.get(this).chars;
    }
  }, {
    key: "getBitsPerChar",
    value: function getBitsPerChar() {
      return propMap.get(this).bitsPerChar;
    }
  }, {
    key: "getNdxFn",
    value: function getNdxFn() {
      return propMap.get(this).ndxFn;
    }
  }, {
    key: "getCharsPerChunk",
    value: function getCharsPerChunk() {
      return propMap.get(this).charsPerChunk;
    }
  }, {
    key: "length",
    value: function length() {
      return propMap.get(this).length;
    }
  }, {
    key: "bytesNeeded",
    value: function bytesNeeded(entropyBits) {
      var count = Math.ceil(entropyBits / this.bitsPerChar());
      return Math.ceil(count * this.bitsPerChar() / BITS_PER_BYTE);
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

var _ndxFn = function _ndxFn(bitsPerChar) {
  // If BITS_PER_BYTEs is a multiple of bitsPerChar, we can slice off an integer number
  // of chars per byte.
  if (lcm(bitsPerChar, BITS_PER_BYTE) === BITS_PER_BYTE) {
    return function (chunk, slice, bytes) {
      var lShift = bitsPerChar;
      var rShift = BITS_PER_BYTE - bitsPerChar;
      return (bytes[chunk] << lShift * slice & 0xff) >> rShift;
    };
  } // Otherwise, while slicing off bits per char, we will possibly straddle a couple
  // of bytes, so a bit more work is involved


  var slicesPerChunk = lcm(bitsPerChar, BITS_PER_BYTE) / BITS_PER_BYTE;
  return function (chunk, slice, bytes) {
    var bNum = chunk * slicesPerChunk;
    var offset = slice * bitsPerChar / BITS_PER_BYTE;
    var lOffset = Math.floor(offset);
    var rOffset = Math.ceil(offset);
    var rShift = BITS_PER_BYTE - bitsPerChar;
    var lShift = slice * bitsPerChar % BITS_PER_BYTE;
    var ndx = (bytes[bNum + lOffset] << lShift & 0xff) >> rShift;
    var rShiftIt = ((rOffset + 1) * BITS_PER_BYTE - (slice + 1) * bitsPerChar) % BITS_PER_BYTE;

    if (rShift < rShiftIt) {
      ndx += bytes[bNum + rOffset] >> rShiftIt;
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

var _totalOf = function _totalOf(numStrings, log2Risk) {
  if (numStrings == 0) {
    return 0;
  }

  var N;

  if (numStrings < 1000) {
    N = _log2(numStrings) + _log2(numStrings - 1);
  } else {
    N = 2 * _log2(numStrings);
  }

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

var propMap$1 = new WeakMap();
var BITS_PER_BYTE$1 = 8;

var _default = /*#__PURE__*/function () {
  function _default(arg) {
    _classCallCheck(this, _default);

    var charSet;

    if (arg === undefined) {
      charSet = charSet32;
    } else if (arg instanceof CharSet) {
      charSet = arg;
    } else if (typeof arg === 'string' || arg instanceof String) {
      charSet = new CharSet(arg);
    } else {
      throw new Error('Invalid arg: must be either valid CharSet or valid chars');
    }

    var hideProps = {
      charSet: charSet
    };
    propMap$1.set(this, hideProps);
  }

  _createClass(_default, [{
    key: "smallID",
    value: function smallID() {
      var charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propMap$1.get(this).charSet;
      return this.string(29, charSet);
    }
  }, {
    key: "mediumID",
    value: function mediumID() {
      var charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propMap$1.get(this).charSet;
      return this.string(69, charSet);
    }
  }, {
    key: "largeID",
    value: function largeID() {
      var charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propMap$1.get(this).charSet;
      return this.string(99, charSet);
    }
  }, {
    key: "sessionID",
    value: function sessionID() {
      var charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propMap$1.get(this).charSet;
      return this.string(128, charSet);
    }
  }, {
    key: "token",
    value: function token() {
      var charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propMap$1.get(this).charSet;
      return this.string(256, charSet);
    }
  }, {
    key: "string",
    value: function string(entropyBits) {
      var charSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propMap$1.get(this).charSet;
      var bytesNeeded = charSet.bytesNeeded(entropyBits);
      return this.stringWithBytes(entropyBits, _cryptoBytes(bytesNeeded), charSet);
    }
  }, {
    key: "stringRandom",
    value: function stringRandom(entropyBits) {
      var charSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propMap$1.get(this).charSet;
      var bytesNeeded = charSet.bytesNeeded(entropyBits);
      return this.stringWithBytes(entropyBits, _randomBytes(bytesNeeded), charSet);
    }
  }, {
    key: "stringWithBytes",
    value: function stringWithBytes(entropyBits, bytes) {
      var charSet = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : propMap$1.get(this).charSet;
      return _stringWithBytes(entropyBits, bytes, charSet);
    }
  }, {
    key: "bytesNeeded",
    value: function bytesNeeded(entropyBits) {
      var charSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propMap$1.get(this).charSet;
      return charSet.bytesNeeded(entropyBits);
    }
  }, {
    key: "chars",
    value: function chars() {
      return propMap$1.get(this).charSet.chars();
    }
  }, {
    key: "use",
    value: function use(charSet) {
      if (!(charSet instanceof CharSet)) {
        throw new Error('Invalid CharSet');
      }

      propMap$1.get(this).charSet = charSet;
    }
  }, {
    key: "useChars",
    value: function useChars(chars) {
      if (!(typeof chars === 'string' || chars instanceof String)) {
        throw new Error('Invalid chars: Must be string');
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

  var need = Math.ceil(count * (bitsPerChar / BITS_PER_BYTE$1));

  if (bytes.length < need) {
    throw new Error('Insufficient bytes: need ' + need + ' and got ' + bytes.length);
  }

  var charsPerChunk = charSet.getCharsPerChunk();
  var chunks = Math.floor(count / charsPerChunk);
  var partials = count % charsPerChunk;
  var ndxFn = charSet.getNdxFn();
  var chars = charSet.getChars();
  var string = '';

  for (var chunk = 0; chunk < chunks; chunk++) {
    for (var slice = 0; slice < charsPerChunk; slice++) {
      var ndx = ndxFn(chunk, slice, bytes);
      string += chars[ndx];
    }
  }

  for (var _slice = 0; _slice < partials; _slice++) {
    var _ndx = ndxFn(chunks, _slice, bytes);

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
  var dataView = new DataView(new ArrayBuffer(BITS_PER_BYTE$1));

  for (var rNum = 0; rNum < randCount; rNum++) {
    dataView.setFloat64(0, Math.random());

    for (var n = 0; n < BYTES_USED_PER_RANDOM_CALL; n++) {
      var fByteNum = _endianByteNum[n];
      var bByteNum = rNum * BYTES_USED_PER_RANDOM_CALL + n;

      if (bByteNum < count) {
        buffer[bByteNum] = dataView.getUint8(fByteNum);
      }
    }
  }

  return buffer;
};

var _endianByteNum = function () {
  var buf32 = new Uint32Array(1);
  var buf8 = new Uint8Array(buf32.buffer);
  buf32[0] = 0xff;
  return buf8[0] === 0xff ? [2, 3, 4, 5, 6, 7] : [0, 1, 2, 3, 6, 7];
}();

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Random: _default,
  Entropy: Entropy,
  CharSet: CharSet,
  charSet2: charSet2,
  charSet4: charSet4,
  charSet8: charSet8,
  charSet16: charSet16,
  charSet32: charSet32,
  charSet64: charSet64
});

var increment = 0;
var pid = Math.floor(Math.random() * 32767);
var machine = Math.floor(Math.random() * 16777216);
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
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var a0 = args[0];

    if (_typeof(a0) === 'object') {
      this.timestamp = a0.timestamp;
      this.machine = a0.machine;
      this.pid = a0.pid;
      this.increment = a0.increment;
    } else if (typeof a0 === 'string' && a0.length === 24) {
      this.timestamp = Number("0x".concat(a0.substr(0, 8)));
      this.machine = Number("0x".concat(a0.substr(8, 6)));
      this.pid = Number("0x".concat(a0.substr(14, 4)));
      this.increment = Number("0x".concat(a0.substr(18, 6)));
    } else if (arguments.length === 4 && a0 !== null) {
      this.timestamp = a0;
      this.machine = args[1];
      this.pid = args[2];
      this.increment = args[3];
    } else {
      this.timestamp = Math.floor(new Date().valueOf() / 1000);
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
    var strOid = this.toString();
    var array = [];
    var i;

    for (i = 0; i < 12; i++) {
      array[i] = parseInt(strOid.slice(i * 2, i * 2 + 2), 16);
    }

    return array;
  },
  toString: function toString() {
    var timestamp = this.timestamp.toString(16);
    var mach = this.machine.toString(16);
    var pd = this.pid.toString(16);
    var incr = this.increment.toString(16);
    return '00000000'.substr(0, 8 - timestamp.length) + timestamp + '000000'.substr(0, 6 - mach.length) + mach + '0000'.substr(0, 4 - pd.length) + pd + '000000'.substr(0, 6 - incr.length) + incr;
  }
};

var objectID = function objectID(args) {
  return Object.create(ID).setup(args);
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
var RandomString = {
  init: function init(total, risk) {
    _instance = Object.create(_random).setup(total, risk);
  },
  string: function string() {
    if (!_instance) {
      RandomString.init();
    }

    return _instance.string();
  }
};

var RBAC = {
  init: function init(roles) {
    // If not a function then should be object
    if (_typeof(roles) !== 'object') {
      throw new TypeError('Expected input to be function or object');
    }

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
        roles[role].inherits.forEach(function (child) {
          if (typeof child !== 'string') {
            throw new TypeError("Expected roles[".concat(role, "].inherits element"));
          }

          if (!roles[child]) {
            throw new TypeError("Undefined inheritance role: ".concat(child));
          }

          map[role].inherits.push(child);
        });
      } // Iterate allowed operations


      roles[role].can.forEach(function (operation) {
        // If operation is string
        if (typeof operation === 'string') {
          // Add as an operation
          map[role].can[operation] = 1;
          return;
        } // Check if operation has a .when function


        if (typeof operation.when === 'function' && typeof operation.name === 'string') {
          map[role].can[operation.name] = operation.when;
          return;
        }

        throw new TypeError("Unexpected operation type ".concat(operation));
      });
      return map;
    }, {}); // Add roles to class and mark as inited

    this.roles = map;
    this._inited = true;
    return this;
  },
  canSync: function canSync(role, operation, params) {
    var _this = this;

    // If not inited then wait until init finishes
    if (!this._inited) {
      return this._init.then(function () {
        return _this.can(role, operation, params);
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
      if (!$role.inherits || $role.inherits.length < 1) {
        return false;
      } // Return if any parent resolves true or all reject


      return $role.inherits.some(function (parent) {
        return _this.canSync(parent, operation, params);
      });
    } // We have the operation resolve


    if ($role.can[operation] === 1) {
      return true;
    } // Operation is conditional, run async function


    if (typeof $role.can[operation] === 'function') {
      $role.can[operation](params, function (err, result) {
        if (err) {
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
  can: function can(role, operation, params) {
    var _this2 = this;

    // If not inited then wait until init finishes
    if (!this._inited) {
      return this._init.then(function () {
        return _this2.can(role, operation, params);
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
        if (!$role.inherits || $role.inherits.length < 1) {
          return reject(new Error('unauthorized'));
        } // Return if any parent resolves true or all reject


        return Promise.all($role.inherits.map(function (parent) {
          return _this2.can(parent, operation, params).then(function () {
            return true;
          }).catch(function () {
            return false;
          });
        })).then(function (result) {
          if (result.some(function (r) {
            return r;
          })) {
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
        $role.can[operation](params, function (err, result) {
          if (err) {
            return reject(err);
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

var increment$1 = 0;
var pid$1 = Math.floor(Math.random() * 32767);
var machine$1 = Math.floor(Math.random() * 16777216); // if (typeof localStorage !== 'undefined') {
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
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var a0 = args[0];

    if (_typeof(a0) === 'object') {
      this.timestamp = a0.timestamp;
      this.machine = a0.machine;
      this.pid = a0.pid;
      this.increment = a0.increment;
    } else if (typeof a0 === 'string' && a0.length === 24) {
      this.timestamp = Number("0x".concat(a0.substr(0, 8)));
      this.machine = Number("0x".concat(a0.substr(8, 6)));
      this.pid = Number("0x".concat(a0.substr(14, 4)));
      this.increment = Number("0x".concat(a0.substr(18, 6)));
    } else if (arguments.length === 4 && a0 !== null) {
      this.timestamp = a0;
      this.machine = args[1];
      this.pid = args[2];
      this.increment = args[3];
    } else {
      this.timestamp = Math.floor(new Date().valueOf() / 1000);
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
    var strOid = this.toString();
    var array = [];
    var i;

    for (i = 0; i < 12; i++) {
      array[i] = parseInt(strOid.slice(i * 2, i * 2 + 2), 16);
    }

    return array;
  },
  toString: function toString() {
    var timestamp = this.timestamp.toString(16);
    var mach = this.machine.toString(16);
    var pd = this.pid.toString(16);
    var incr = this.increment.toString(16);
    return '00000000'.substr(0, 8 - timestamp.length) + timestamp + '000000'.substr(0, 6 - mach.length) + mach + '0000'.substr(0, 4 - pd.length) + pd + '000000'.substr(0, 6 - incr.length) + incr;
  }
};

var objectId = function objectId(args) {
  return Object.create(ObjectId).setup(args);
};

export { ElapsedTimer, index as EntropyString, RBAC, RandomString, objectID, shuffle, objectId as uniqueId };
//# sourceMappingURL=onc.esm.fallback.js.map
