let _rng = Math.random;

function rng() {
  return _rng();
}

// Use Fisher–Yates shuffle http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
// see also http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// to get random permutation from a finite set.
/**
 * @param {any} array
 * @param {number} size
 */
function getRandomSubarray(array, size) {
  const shuffled = [];
  let index = 0;
  let rand;
  for (const value of array) {
    rand = Math.floor((index++ + 1) * _rng());
    shuffled[index - 1] = shuffled[rand];
    shuffled[rand] = value;
  }

  // return the part we want
  return size ? shuffled.slice(0, size) : shuffled;
}

// Use Fisher–Yates shuffle http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
// see also http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// to get random permutation from a finite set.
/**
 * @param {string | any[]} array
 * @param {number} size
 */
function getRandomSubarrayAlt(array, size) {
  const shuffled = [...array];
  let count = array.length;
  let rand;
  let temporary;
  while (count) {
    rand = Math.trunc(_rng() * count--);
    temporary = array[count];
    array[String(count)] = array[rand];
    array[String(rand)] = temporary;
  }

  // return the part we want
  return size ? shuffled.slice(0, size) : shuffled;
}

function setRng(newrng) {
  _rng = newrng;
}

export default {
  getRandomSubarray,
  getRandomSubarrayAlt,
  setRng,
  rng,
};

export { setRng, rng, getRandomSubarray, getRandomSubarrayAlt };
