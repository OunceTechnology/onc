const _now = (function(self) {
  'use strict';

  return self.performance && self.performance.now
    ? function() {
        return self.performance.now();
      }
    : function() {
        return Date.now();
      };
})(typeof self !== 'undefined' ? self : window);

// function now() {
//   return _now();
// }

export const ElapsedTimer = {
  start() {
    this.startDate = new Date();
    this.startTime = _now();
  },

  elapsed(precision) {
    if (precision === undefined) {
      precision = 2;
    }

    return Number((_now() - this.startTime).toFixed(precision));
  },

  elapsedFull() {
    return _now() - this.startTime;
  },
};
