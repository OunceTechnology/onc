import { objectID } from './objectId.js';
import { Reconnect } from './reconnect.js';
import { http } from './http.js';
import Emitter from 'vue';
import lf from 'localforage';

let _mgr;
const _retryTimeout = 10000;
const _responseTimeout = 3000;

function checkFetch(url, options) {
  return Promise.race([
    http.fetchAndHandle(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), _responseTimeout),
    ),
  ]).then(response => {
    if (!response.ok) {
      throw new Error('Error');
    }
  });
}

const Manager = {
  setup(db, apppath, uploadurl) {
    this.uploading = false;
    this.uploadurl = uploadurl;
    this.size = 0;

    this.db = db;

    this.state = 'up';
    this.uploadtriggered = false;
    this.emitter = new Emitter();

    this.reconnect = Object.create(Reconnect).setup(apppath, new Emitter());

    this.reconnect.$on('up', () => this.handleUp());
    this.reconnect.$on('down', () => this.handleDown());
  },

  $on(event, callback) {
    this.emitter.$on(event, callback);
  },

  $off(event, callback) {
    this.emitter.$off(event, callback);
  },

  getQueueLength() {
    return this.db.keys().then(keys => {
      return keys.length;
    });
  },

  processQueue() {
    return this.getQueueLength()
      .then(ln => {
        this.size = ln;
        this.emitter.$emit('dm:size', ln);
      })
      .then(() => {
        if (this.state === 'up') {
          this.triggerUpload();
        } else if (this.state !== 'waiting') {
          this.state = 'waiting';
          this.emitter.$emit('dm:waiting');
          this.emitter.$emit('dm:state', 'waiting');
          this.reconnect.reconnect();
        }
      })
      .catch(e => console.log(e.toString()));
  },

  handleUp() {
    if (this.state === 'waiting' || this.state === 'checking') {
      this.reconnect.stop();
      this.triggerUpload();
    }

    this.state = 'up';
    this.emitter.$emit('dm:up');
    this.emitter.$emit('dm:state', 'up');
  },

  handleDown() {
    if (this.state === 'up') {
      this.state = 'down';
      this.emitter.$emit('dm:down');
      this.emitter.$emit('dm:state', 'down');
    } else if (this.state === 'checking') {
      this.state = 'waiting';
      this.emitter.$emit('dm:waiting');
      this.emitter.$emit('dm:state', 'waiting');
      this.reconnect.reconnect();
    }
    // console.log(this.state);
  },

  triggerUpload() {
    if (this.uploading || this.uploadtriggered) {
      return;
    }

    this.uploadtriggered = true;

    setTimeout(() => {
      this.uploadtriggered = false;
      this.uploadNow();
    }, 100);
  },

  save({ token, value }) {
    const item = {
      id: objectID().toString(),
      token,
      createDate: new Date(),
      value,
    };

    this.size += 1;
    this.emitter.$emit('dm:size', this.size);

    return this.db.setItem(item.id, item).then(() => {
      if (this.state === 'up') {
        this.triggerUpload();
      } else if (this.state !== 'waiting') {
        this.state = 'waiting';
        this.emitter.$emit('dm:waiting');
        this.emitter.$emit('dm:state', 'waiting');
        this.reconnect.reconnect();
      }

      return item.id;
    });
  },

  processKey(key) {
    return this.db.getItem(key).then(data => {
      const url = data.value.uploadurl || this.uploadurl || '/api/data/';
      const method = data.value.method || 'post';

      return checkFetch(url, {
        method,
        body: JSON.stringify(data),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }).then(() => {
        // console.log(`deleting data: ${key}`);
        this.db.removeItem(key);
        if (this.size > 0) {
          this.size -= 1;
          this.emitter.$emit('dm:size', this.size);
        }
      });
    });
  },

  processKeys(keys) {
    if (!keys || keys.length === 0) {
      keys = [];
    }

    return keys.reduce((p, v) => {
      return p.then(() => this.processKey(v));
    }, Promise.resolve());
  },

  uploadNow() {
    if (this.uploading) {
      return;
    }
    this.uploading = true;

    this.db
      .keys()
      .then(keys => {
        return this.processKeys(keys);
      })
      .then(() => {
        this.uploading = false;
        if (this.size > 0 && this.state === 'up') {
          // always ensure a delay before uploading new data
          setTimeout(() => this.uploadNow(), 1000);
        }
      })
      .catch(e => {
        this.uploading = false;
        console.dir(e.toString());

        this.retryTimer = setTimeout(() => {
          this.state = 'checking';
          this.emitter.$emit('dm:checking');
          this.emitter.$emit('dm:state', 'checking');
          this.reconnect.check();
        }, _retryTimeout);
      });
  },

  clearQueue() {
    return this.db.clear();
  },
};

function getDefaultDB(name = 'dbStore') {
  return lf.createInstance({ name, storeName: 'queue' });
}

export const DataManager = {
  init(apppath, uploadurl, options = {}) {
    // if passed a string as options, it is the name of the store.
    if (typeof options === 'string') {
      options = { name: options };
    }

    if (!_mgr) {
      const db = options.db || getDefaultDB(options.name);
      _mgr = Object.create(Manager);
      _mgr.setup(db, apppath, uploadurl);
      return _mgr.processQueue();
    }
  },
  get mgr() {
    return _mgr;
  },
};
