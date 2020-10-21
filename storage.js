const _self = self || window;
const _storage = _self.localStorage;

let _prefix = '';

const storage = {
  setPrefix(pfx) {
    _prefix = pfx;
  },
  //
  // Designed to take a JS object, stringify, and store result
  // in localStorage. Might need to think about compression if large UTF16 strings use up excessive space.
  // If value is a plain string, then it is stored as-is.
  setItem(key, value, replacer) {
    let data = value;

    if (typeof value !== 'string') {
      // add black knight to indicate stringified
      data = String.fromCharCode(9822) + JSON.stringify(value, replacer);
    }

    try {
      _storage.setItem(_prefix + key, data);
    } catch (e) {
      if (e.name.toUpperCase().indexOf('QUOTA') >= 0) {
        console.error(`setItem  (${key}) storage quota exceeded.`);
      }
    }
  },

  // Get item from localStorage, parse and return JS object.
  getItem(key, prefix) {
    if (prefix === undefined) {
      prefix = _prefix;
    }

    let data = _storage.getItem(prefix + key);

    // If not prefixed with a black knight, just return the plain string.
    if (!data || data.charCodeAt(0) !== 9822) {
      return data;
    }

    data = data.slice(1);

    if (data === 'undefined') {
      return undefined;
    }

    try {
      return JSON.parse(data || 'false');
    } catch (e) {
      console.dir(e);
      console.log(`Storage failed getting item: ${key}`);
      return false;
    }
  },

  // remove named item from storage
  removeItem(key) {
    _storage.removeItem(_prefix + key); // this method does nothing if the key does not exist in the store.
  },

  // all localstorage items
  getKeys() {
    const keys = [];
    for (let i = 0; i < _storage.length; ++i) {
      const key = _storage.key(i);
      if (!key.startsWith(_prefix)) {
        continue;
      }
      // build list of natural keys (without storage prefix)
      keys.push(key.substr(_prefix.length));
    }
    return keys;
  },

  // clear entire local storage
  clear() {
    _storage.clear();
  },
};

Object.defineProperty(storage, 'len', {
  get() {
    return _storage.length;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(storage, 'prefix', {
  get() {
    return _prefix;
  },
  set(newValue) {
    _prefix = newValue || '';
    if (_prefix && !_prefix.endsWith(':')) {
      _prefix += ':';
    }
  },
  enumerable: true,
  configurable: true,
});

export default storage;
