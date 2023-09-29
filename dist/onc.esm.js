let _rng = Math.random;

function rng() {
  return _rng();
} // Use Fisher–Yates shuffle http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
// see also http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// to get random permutation from a finite set.


function getRandomSubarray(arr, size) {
  const shuffled = [];
  let index = 0;
  let rand;
  arr.forEach(value => {
    rand = Math.floor((index++ + 1) * _rng());
    shuffled[index - 1] = shuffled[rand];
    shuffled[rand] = value;
  }); // return the part we want

  return size ? shuffled.slice(0, size) : shuffled;
} // Use Fisher–Yates shuffle http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
// see also http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// to get random permutation from a finite set.


function getRandomSubarrayAlt(arr, size) {
  const shuffled = arr.slice();
  let count = arr.length;
  let rand;
  let temp;

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
  getRandomSubarray,
  getRandomSubarrayAlt,
  setRng,
  rng
};

const _now = function (self) {
  return self.performance && self.performance.now ? function () {
    return self.performance.now();
  } : function () {
    return Date.now();
  };
}(typeof self !== 'undefined' ? self : window);

class ElapsedTimer {
  /**
   * Start the timer
   */
  start() {
    this.startDate = new Date();
    this.startTime = _now();
  }
  /**
   *
   * @param {Number} precision
   * @returns {Number} Elapsed time (ms) to precision decimal places
   */


  elapsed() {
    let precision = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
    return Number(this.elapsedFull().toFixed(precision));
  }
  /**
   *
   * @returns Elapsed time in ms
   */


  elapsedFull() {
    return _now() - this.startTime;
  }

}

const _gcd = (a, b) => {
  while (b != 0) {
    [a, b] = [b, a % b];
  }

  return Math.abs(a);
};

var lcm = ((a, b) => {
  return a / _gcd(a, b) * b;
});

const propertyMap$1 = new WeakMap();
const BITS_PER_BYTE$1 = 8;
class CharSet {
  constructor(chars) {
    if (!(typeof chars === 'string' || chars instanceof String)) {
      throw new TypeError('Invalid chars: Must be string');
    }

    const length = chars.length;

    if (![2, 4, 8, 16, 32, 64].includes(length)) {
      throw new Error('Invalid char count: must be one of 2,4,8,16,32,64');
    }

    const bitsPerChar = Math.floor(Math.log2(length)); // Ensure no repeated characters

    for (let index = 0; index < length; index++) {
      const c = chars.charAt(index);

      for (let index_ = index + 1; index_ < length; index_++) {
        if (c === chars.charAt(index_)) {
          throw new Error('Characters not unique');
        }
      }
    }

    const privProps = {
      chars,
      bitsPerChar,
      length,
      ndxFn: _ndxFunction(bitsPerChar),
      charsPerChunk: lcm(bitsPerChar, BITS_PER_BYTE$1) / bitsPerChar
    };
    propertyMap$1.set(this, privProps);
  }

  getChars() {
    return propertyMap$1.get(this).chars;
  }

  getBitsPerChar() {
    return propertyMap$1.get(this).bitsPerChar;
  }

  getNdxFn() {
    return propertyMap$1.get(this).ndxFn;
  }

  getCharsPerChunk() {
    return propertyMap$1.get(this).charsPerChunk;
  }

  length() {
    return propertyMap$1.get(this).length;
  }

  bytesNeeded(entropyBits) {
    const count = Math.ceil(entropyBits / this.bitsPerChar());
    return Math.ceil(count * this.bitsPerChar() / BITS_PER_BYTE$1);
  } // Aliases


  chars() {
    return this.getChars();
  }

  ndxFn() {
    return this.getNdxFn();
  }

  bitsPerChar() {
    return this.getBitsPerChar();
  }

}

const _ndxFunction = bitsPerChar => {
  // If BITS_PER_BYTEs is a multiple of bitsPerChar, we can slice off an integer number
  // of chars per byte.
  if (lcm(bitsPerChar, BITS_PER_BYTE$1) === BITS_PER_BYTE$1) {
    return function (chunk, slice, bytes) {
      const lShift = bitsPerChar;
      const rShift = BITS_PER_BYTE$1 - bitsPerChar;
      return (bytes[chunk] << lShift * slice & 0xff) >> rShift;
    };
  } // Otherwise, while slicing off bits per char, we will possibly straddle a couple
  // of bytes, so a bit more work is involved


  const slicesPerChunk = lcm(bitsPerChar, BITS_PER_BYTE$1) / BITS_PER_BYTE$1;
  return function (chunk, slice, bytes) {
    const bNumber = chunk * slicesPerChunk;
    const offset = slice * bitsPerChar / BITS_PER_BYTE$1;
    const lOffset = Math.floor(offset);
    const rOffset = Math.ceil(offset);
    const rShift = BITS_PER_BYTE$1 - bitsPerChar;
    const lShift = slice * bitsPerChar % BITS_PER_BYTE$1;
    let ndx = (bytes[bNumber + lOffset] << lShift & 0xff) >> rShift;
    const rShiftIt = ((rOffset + 1) * BITS_PER_BYTE$1 - (slice + 1) * bitsPerChar) % BITS_PER_BYTE$1;

    if (rShift < rShiftIt) {
      ndx += bytes[bNumber + rOffset] >> rShiftIt;
    }

    return ndx;
  };
};

const charSet64 = new CharSet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_');
const charSet32 = new CharSet('2346789bdfghjmnpqrtBDFGHJLMNPQRT');
const charSet16 = new CharSet('0123456789abcdef');
const charSet8 = new CharSet('01234567');
const charSet4 = new CharSet('ATCG');
const charSet2 = new CharSet('01');

const _log2 = Math.log2;

const _totalOf = (numberStrings, log2Risk) => {
  if (numberStrings == 0) {
    return 0;
  }

  const N = numberStrings < 1000 ? _log2(numberStrings) + _log2(numberStrings - 1) : 2 * _log2(numberStrings);
  return N + log2Risk - 1;
};

const bits = (total, risk) => {
  if (total == 0) {
    return 0;
  }

  return _totalOf(total, _log2(risk));
};

var Entropy = {
  bits
};

const propertyMap = new WeakMap();
const BITS_PER_BYTE = 8;
class Random {
  constructor(argument) {
    let charSet;

    if (argument === undefined) {
      charSet = charSet32;
    } else if (argument instanceof CharSet) {
      charSet = argument;
    } else if (typeof argument === 'string' || argument instanceof String) {
      charSet = new CharSet(argument);
    } else {
      throw new TypeError('Invalid arg: must be either valid CharSet or valid chars');
    }

    const hideProps = {
      charSet
    };
    propertyMap.set(this, hideProps);
  }

  smallID() {
    let charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propertyMap.get(this).charSet;
    return this.string(29, charSet);
  }

  mediumID() {
    let charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propertyMap.get(this).charSet;
    return this.string(69, charSet);
  }

  largeID() {
    let charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propertyMap.get(this).charSet;
    return this.string(99, charSet);
  }

  sessionID() {
    let charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propertyMap.get(this).charSet;
    return this.string(128, charSet);
  }

  token() {
    let charSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : propertyMap.get(this).charSet;
    return this.string(256, charSet);
  }

  string(entropyBits) {
    let charSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propertyMap.get(this).charSet;
    const bytesNeeded = charSet.bytesNeeded(entropyBits);
    return this.stringWithBytes(entropyBits, _cryptoBytes(bytesNeeded), charSet);
  }

  stringRandom(entropyBits) {
    let charSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propertyMap.get(this).charSet;
    const bytesNeeded = charSet.bytesNeeded(entropyBits);
    return this.stringWithBytes(entropyBits, _randomBytes(bytesNeeded), charSet);
  }

  stringWithBytes(entropyBits, bytes) {
    let charSet = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : propertyMap.get(this).charSet;
    return _stringWithBytes(entropyBits, bytes, charSet);
  }

  bytesNeeded(entropyBits) {
    let charSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : propertyMap.get(this).charSet;
    return charSet.bytesNeeded(entropyBits);
  }

  chars() {
    return propertyMap.get(this).charSet.chars();
  }

  use(charSet) {
    if (!(charSet instanceof CharSet)) {
      throw new TypeError('Invalid CharSet');
    }

    propertyMap.get(this).charSet = charSet;
  }

  useChars(chars) {
    if (!(typeof chars === 'string' || chars instanceof String)) {
      throw new TypeError('Invalid chars: Must be string');
    }

    this.use(new CharSet(chars));
  }

}

const _stringWithBytes = (entropyBits, bytes, charSet) => {
  if (entropyBits <= 0) {
    return '';
  }

  const bitsPerChar = charSet.getBitsPerChar();
  const count = Math.ceil(entropyBits / bitsPerChar);

  if (count <= 0) {
    return '';
  }

  const need = Math.ceil(count * (bitsPerChar / BITS_PER_BYTE));

  if (bytes.length < need) {
    throw new Error('Insufficient bytes: need ' + need + ' and got ' + bytes.length);
  }

  const charsPerChunk = charSet.getCharsPerChunk();
  const chunks = Math.floor(count / charsPerChunk);
  const partials = count % charsPerChunk;
  const ndxFunction = charSet.getNdxFn();
  const chars = charSet.getChars();
  let string = '';

  for (let chunk = 0; chunk < chunks; chunk++) {
    for (let slice = 0; slice < charsPerChunk; slice++) {
      const ndx = ndxFunction(chunk, slice, bytes);
      string += chars[ndx];
    }
  }

  for (let slice = 0; slice < partials; slice++) {
    const ndx = ndxFunction(chunks, slice, bytes);
    string += chars[ndx];
  }

  return string;
};

const _cryptoBytes = count => {
  const buffer = new Uint8Array(count);
  window.crypto.getRandomValues(buffer);
  return buffer;
};

const _randomBytes = count => {
  const BYTES_USED_PER_RANDOM_CALL = 6;
  const randCount = Math.ceil(count / BYTES_USED_PER_RANDOM_CALL);
  const buffer = new Uint8Array(count);
  const dataView = new DataView(new ArrayBuffer(BITS_PER_BYTE));

  for (let rNumber = 0; rNumber < randCount; rNumber++) {
    dataView.setFloat64(0, Math.random());

    for (let n = 0; n < BYTES_USED_PER_RANDOM_CALL; n++) {
      const fByteNumber = _endianByteNumber[n];
      const bByteNumber = rNumber * BYTES_USED_PER_RANDOM_CALL + n;

      if (bByteNumber < count) {
        buffer[bByteNumber] = dataView.getUint8(fByteNumber);
      }
    }
  }

  return buffer;
};

const _endianByteNumber = (() => {
  const buf32 = new Uint32Array(1);
  const buf8 = new Uint8Array(buf32.buffer);
  buf32[0] = 0xff;
  return buf8[0] === 0xff ? [2, 3, 4, 5, 6, 7] : [0, 1, 2, 3, 6, 7];
})();

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
  Random: Random
});

let increment$1 = 0;
const pid$1 = Math.floor(Math.random() * 32_767);
const machine$1 = Math.floor(Math.random() * 16_777_216); // eslint-disable-next-line unicorn/no-document-cookie

document.cookie = `mongoMachineId=;expires=${new Date().toUTCString()};path=/;domain=${location.hostname}`;

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


const ID = {
  // private timestamp: any
  // private machine: number
  // private pid: number
  // private increment: number
  setup() {
    for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
      arguments_[_key] = arguments[_key];
    }

    const a0 = arguments_[0];

    if (typeof a0 === 'object') {
      this.timestamp = a0.timestamp;
      this.machine = a0.machine;
      this.pid = a0.pid;
      this.increment = a0.increment;
    } else if (typeof a0 === 'string' && a0.length === 24) {
      this.timestamp = Number(`0x${a0.slice(0, 8)}`);
      this.machine = Number(`0x${a0.slice(8, 14)}`);
      this.pid = Number(`0x${a0.slice(14, 18)}`);
      this.increment = Number(`0x${a0.slice(18, 24)}`);
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

      if (increment$1 > 0xff_ff_ff) {
        increment$1 = 0;
      }
    }

    return this;
  },

  getDate() {
    return new Date(this.timestamp * 1000);
  },

  toArray() {
    const stringOid = this.toString();
    const array = [];
    let index;

    for (index = 0; index < 12; index++) {
      array[index] = Number.parseInt(stringOid.slice(index * 2, index * 2 + 2), 16);
    }

    return array;
  },

  toString() {
    const timestamp = this.timestamp.toString(16);
    const mach = this.machine.toString(16);
    const pd = this.pid.toString(16);
    const incr = this.increment.toString(16);
    return '00000000'.slice(0, Math.max(0, 8 - timestamp.length)) + timestamp + '000000'.slice(0, Math.max(0, 6 - mach.length)) + mach + '0000'.slice(0, Math.max(0, 4 - pd.length)) + pd + '000000'.slice(0, Math.max(0, 6 - incr.length)) + incr;
  }

};

const objectID = function (arguments_) {
  return Object.create(ID).setup(arguments_);
};

let _instance;

const _random = {
  setup() {
    let total = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1e6;
    let risk = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1e9;
    this.random = new Random();
    this.bits = Entropy.bits(total, risk);
    return this;
  },

  string() {
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

class RBAC {
  constructor(roles) {
    // If not a function then should be object
    if (typeof roles !== 'object') {
      throw new TypeError('Expected input to be function or object');
    }

    const map = {};

    for (const [role, value] of Object.entries(roles)) {
      map[role] = {
        can: {}
      }; // Check can definition

      if (!Array.isArray(value.can)) {
        throw new TypeError(`Expected roles[${role}].can to be an array`);
      }

      if (value.inherits) {
        if (!Array.isArray(value.inherits)) {
          throw new TypeError(`Expected roles[${role}].inherits to be an array`);
        }

        map[role].inherits = [];

        for (const child of value.inherits) {
          if (typeof child !== 'string') {
            throw new TypeError(`Expected roles[${role}].inherits element`);
          }

          if (!roles[child]) {
            throw new TypeError(`Undefined inheritance role: ${child}`);
          }

          map[role].inherits.push(child);
        }
      } // Iterate allowed operations


      for (const operation of value.can) {
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

        throw new TypeError(`Unexpected operation type ${operation}`);
      }
    } // Add roles to class and mark as inited


    this.roles = map;
  }
  /**
   * @param {string } role
   * @param {string} operation
   * @param {any} parameters
   */


  canSync(role, operation, parameters) {
    if (typeof role !== 'string') {
      throw new TypeError('Expected first parameter to be string : role');
    }

    if (typeof operation !== 'string') {
      throw new TypeError('Expected second parameter to be string : operation');
    }

    const $role = this.roles[role];

    if (!$role) {
      throw new Error('Undefined role');
    } // IF this operation is not defined at current level try higher


    if (!$role.can[operation]) {
      // If no parents reject
      if (!$role.inherits || $role.inherits.length === 0) {
        return false;
      } // Return if any parent resolves true or all reject


      return $role.inherits.some(parent => {
        return this.canSync(parent, operation, parameters);
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
  }

  can(role, operation, parameters) {
    return new Promise((resolve, reject) => {
      if (typeof role !== 'string') {
        throw new TypeError('Expected first parameter to be string : role');
      }

      if (typeof operation !== 'string') {
        throw new TypeError('Expected second parameter to be string : operation');
      }

      const $role = this.roles[role];

      if (!$role) {
        throw new Error('Undefined role');
      } // IF this operation is not defined at current level try higher


      if (!$role.can[operation]) {
        // If no parents reject
        if (!$role.inherits || $role.inherits.length === 0) {
          return reject(new Error('unauthorized'));
        } // Return if any parent resolves true or all reject


        return Promise.all($role.inherits.map(parent => {
          return this.can(parent, operation, parameters).then(() => true).catch(() => false);
        })).then(result => {
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

}

let increment = 0;
const pid = Math.floor(Math.random() * 32_767);
const machine = Math.floor(Math.random() * 16_777_216); // if (typeof localStorage !== 'undefined') {
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

const ObjectId = {
  // private timestamp: any
  // private machine: number
  // private pid: number
  // private increment: number
  setup() {
    for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
      arguments_[_key] = arguments[_key];
    }

    const a0 = arguments_[0];

    if (typeof a0 === 'object') {
      this.timestamp = a0.timestamp;
      this.machine = a0.machine;
      this.pid = a0.pid;
      this.increment = a0.increment;
    } else if (typeof a0 === 'string' && a0.length === 24) {
      this.timestamp = Number(`0x${a0.slice(0, 8)}`);
      this.machine = Number(`0x${a0.slice(8, 14)}`);
      this.pid = Number(`0x${a0.slice(14, 18)}`);
      this.increment = Number(`0x${a0.slice(18, 24)}`);
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

      if (increment > 0xff_ff_ff) {
        increment = 0;
      }
    }

    return this;
  },

  getDate() {
    return new Date(this.timestamp * 1000);
  },

  toArray() {
    const stringOid = this.toString();
    const array = [];
    let index;

    for (index = 0; index < 12; index++) {
      array[index] = Number.parseInt(stringOid.slice(index * 2, index * 2 + 2), 16);
    }

    return array;
  },

  toString() {
    const timestamp = this.timestamp.toString(16);
    const mach = this.machine.toString(16);
    const pd = this.pid.toString(16);
    const incr = this.increment.toString(16);
    return '00000000'.slice(0, Math.max(0, 8 - timestamp.length)) + timestamp + '000000'.slice(0, Math.max(0, 6 - mach.length)) + mach + '0000'.slice(0, Math.max(0, 4 - pd.length)) + pd + '000000'.slice(0, Math.max(0, 6 - incr.length)) + incr;
  }

};

const objectId = function (arguments_) {
  return Object.create(ObjectId).setup(arguments_);
};

export { ElapsedTimer, index as EntropyString, RBAC, randomString as RandomString, getRandomSubarray, getRandomSubarrayAlt, objectID, rng, setRng, shuffle, objectId as uniqueId };
//# sourceMappingURL=onc.esm.js.map
