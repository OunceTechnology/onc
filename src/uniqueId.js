let increment = 0;
const pid = Math.floor(Math.random() * 32767);
const machine = Math.floor(Math.random() * 16777216);

// if (typeof localStorage !== 'undefined') {
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

  setup(...args) {
    const a0 = args[0];

    if (typeof a0 === 'object') {
      this.timestamp = a0.timestamp;
      this.machine = a0.machine;
      this.pid = a0.pid;
      this.increment = a0.increment;
    } else if (typeof a0 === 'string' && a0.length === 24) {
      this.timestamp = Number(`0x${a0.substr(0, 8)}`);
      this.machine = Number(`0x${a0.substr(8, 6)}`);
      this.pid = Number(`0x${a0.substr(14, 4)}`);
      this.increment = Number(`0x${a0.substr(18, 6)}`);
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

  getDate() {
    return new Date(this.timestamp * 1000);
  },

  toArray() {
    const strOid = this.toString();
    const array = [];
    let i;
    for (i = 0; i < 12; i++) {
      array[i] = parseInt(strOid.slice(i * 2, i * 2 + 2), 16);
    }
    return array;
  },

  toString() {
    const timestamp = this.timestamp.toString(16);
    const mach = this.machine.toString(16);
    const pd = this.pid.toString(16);
    const incr = this.increment.toString(16);
    return (
      '00000000'.substr(0, 8 - timestamp.length) +
      timestamp +
      '000000'.substr(0, 6 - mach.length) +
      mach +
      '0000'.substr(0, 4 - pd.length) +
      pd +
      '000000'.substr(0, 6 - incr.length) +
      incr
    );
  },
};

const objectId = function(args) {
  return Object.create(ObjectId).setup(args);
};

export default objectId;
