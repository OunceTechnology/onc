let _rng = Math.random;

function rng() {
  return _rng();
}

// Use Fisher–Yates shuffle http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
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
  });

  // return the part we want
  return size ? shuffled.slice(0, size) : shuffled;
}

// Use Fisher–Yates shuffle http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
// see also http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// to get random permutation from a finite set.
function getRandomSubarrayAlt(arr, size) {
  const shuffled = arr.slice();
  let count = arr.length;
  let rand;
  let temp;
  while (count) {
    rand = (_rng() * count--) | 0;
    temp = arr[count];
    arr[count] = arr[rand];
    arr[rand] = temp;
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
