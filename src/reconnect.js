const _self = typeof self !== 'undefined' ? self : window;

const _testUrl = (apppath = '') => {
  return `${apppath}/favicon.ico?_=${Math.floor(Math.random() * 1_000_000_000)}`;
};

const _responseTimeout = 5000;
const _rcInitialDelay = 3000;

function checkFetch(url, apppath) {
  if (!url) {
    url = _testUrl(apppath);
  }
  return Promise.race([
    fetch(url, { method: 'head' }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), _responseTimeout)),
  ]).then(response => {
    if (!response.ok) {
      throw new Error('Error');
    }
  });
}

function initWindowListeners(callback) {
  if (typeof _self.addEventListener === 'function') {
    // after the online event fires, the browser needs a short delay before it can reliably make a request
    _self.addEventListener('online', () => setTimeout(() => callback(), 100), false);
    _self.addEventListener('offline', callback, false);
  }
}

function nextDelay(currentDelay) {
  // 1.5 * current delay capped at 1hour
  return Math.min(Math.ceil(currentDelay * 1.5), 3_600_000);
}

const Reconnect = {
  setup(apppath, emitter) {
    this.emitter = emitter;
    this.apppath = apppath;

    initWindowListeners(() => this.check());
    setTimeout(() => this.check(), 0);

    this.state = 'up';
    this.enabled = false;
    this.reset_();

    return this;
  },

  $on(event, callback) {
    this.emitter.$on(event, callback);
  },

  $off(event, callback) {
    this.emitter.$off(event, callback);
  },

  checkComms() {
    checkFetch(undefined, this.apppath)
      .then(() => this.markUp())
      .catch(() => this.markDown());
  },

  check() {
    this.checkComms();
  },

  markUp() {
    if (this.state === 'up') {
      return;
    }

    this.state = 'up';
    if (this.interval !== null) {
      clearInterval(this.interval);
    }

    this.reset_();

    this.emitter.$emit('up');
  },

  markDown() {
    if (this.enabled && this.state === 'connecting') {
      this.state = 'waiting';
      this.remaining = this.delay = nextDelay(this.delay);
      return;
    }
    if (this.state === 'down') {
      return;
    }

    this.state = 'down';
    this.down_();

    this.emitter.$emit('down');
  },

  reconnect() {
    this.enabled = true;
    this.down_();
  },

  down_() {
    if (this.enabled) {
      this.reset_();

      this.state = 'waiting';
      this.interval = setInterval(() => {
        this.tick_();
      }, 1000);

      return this.interval;
    }
  },

  stop() {
    this.enabled = false;
    this.reset_();

    if (this.interval !== null) {
      clearInterval(this.interval);
    }
  },

  tick_() {
    if (this.state === 'connecting') {
      return;
    }

    this.remaining -= 1000; // 1 second ticks

    if (this.remaining <= 0) {
      this.try_();
    }
  },

  try_() {
    if (this.state !== 'waiting') {
      return;
    }

    this.state = 'connecting';
    this.check();
  },

  reset_() {
    this.state = 'inactive';

    this.delay = _rcInitialDelay;
    this.remaining = this.delay;
  },
};

export { Reconnect };
