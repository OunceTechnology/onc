import { Random, Entropy } from './entropy-string/index.js';

let _instance;

const _random = {
  setup(total = 1e6, risk = 1e9) {
    this.random = new Random();
    this.bits = Entropy.bits(total, risk);
    return this;
  },
  string() {
    return this.random.string(this.bits);
  },
};

export function init(total, risk) {
  _instance = Object.create(_random).setup(total, risk);
}

/**
 *
 * @returns {string} A random string
 */
export function string() {
  if (!_instance) {
    init();
  }
  return _instance.string();
}
