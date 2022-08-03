let increment = 0;
const pid = Math.floor(Math.random() * 32_767);
const machine = Math.floor(Math.random() * 16_777_216);

// eslint-disable-next-line unicorn/no-document-cookie
document.cookie = `mongoMachineId=;expires=${new Date().toUTCString()};path=/;domain=${location.hostname}`;

if (typeof localStorage !== 'undefined') {
  localStorage.removeItem('mongoMachineId');
}

// if (typeof localStorage !== 'undefined') {
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

  setup(...arguments_) {
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
    return (
      '00000000'.slice(0, Math.max(0, 8 - timestamp.length)) +
      timestamp +
      '000000'.slice(0, Math.max(0, 6 - mach.length)) +
      mach +
      '0000'.slice(0, Math.max(0, 4 - pd.length)) +
      pd +
      '000000'.slice(0, Math.max(0, 6 - incr.length)) +
      incr
    );
  },
};

const objectID = function (arguments_) {
  return Object.create(ID).setup(arguments_);
};

export { objectID };
