const _now = (function (self) {
  return self.performance && self.performance.now
    ? function () {
        return self.performance.now();
      }
    : function () {
        return Date.now();
      };
})(typeof self !== 'undefined' ? self : window);

export class ElapsedTimer {
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
  elapsed(precision = 2) {
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
