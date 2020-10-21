'use strict';

export const RBAC = {
  init(roles) {
    // If not a function then should be object
    if (typeof roles !== 'object') {
      throw new TypeError('Expected input to be function or object');
    }

    const map = Object.keys(roles).reduce((map, role) => {
      map[role] = {
        can: {},
      };

      // Check can definition
      if (!Array.isArray(roles[role].can)) {
        throw new TypeError(`Expected roles[${role}].can to be an array`);
      }

      if (roles[role].inherits) {
        if (!Array.isArray(roles[role].inherits)) {
          throw new TypeError(`Expected roles[${role}].inherits to be an array`);
        }

        map[role].inherits = [];
        roles[role].inherits.forEach(function(child) {
          if (typeof child !== 'string') {
            throw new TypeError(`Expected roles[${role}].inherits element`);
          }

          if (!roles[child]) {
            throw new TypeError(`Undefined inheritance role: ${child}`);
          }
          map[role].inherits.push(child);
        });
      }

      // Iterate allowed operations
      roles[role].can.forEach(function(operation) {
        // If operation is string
        if (typeof operation === 'string') {
          // Add as an operation
          map[role].can[operation] = 1;
          return;
        }
        // Check if operation has a .when function
        if (typeof operation.when === 'function' && typeof operation.name === 'string') {
          map[role].can[operation.name] = operation.when;
          return;
        }

        throw new TypeError(`Unexpected operation type ${operation}`);
      });

      return map;
    }, {});

    // Add roles to class and mark as inited
    this.roles = map;
    this._inited = true;

    return this;
  },

  canSync(role, operation, params) {
    // If not inited then wait until init finishes
    if (!this._inited) {
      return this._init.then(() => {
        return this.can(role, operation, params);
      });
    }

    if (typeof role !== 'string') {
      throw new TypeError('Expected first parameter to be string : role');
    }

    if (typeof operation !== 'string') {
      throw new TypeError('Expected second parameter to be string : operation');
    }

    const $role = this.roles[role];

    if (!$role) {
      throw new Error('Undefined role');
    }
    // IF this operation is not defined at current level try higher
    if (!$role.can[operation]) {
      // If no parents reject
      if (!$role.inherits || $role.inherits.length < 1) {
        return false;
      }

      // Return if any parent resolves true or all reject
      return $role.inherits.some(parent => {
        return this.canSync(parent, operation, params);
      });
    }

    // We have the operation resolve
    if ($role.can[operation] === 1) {
      return true;
    }

    // Operation is conditional, run async function
    if (typeof $role.can[operation] === 'function') {
      $role.can[operation](params, function(err, result) {
        if (err) {
          return false;
        }
        if (!result) {
          return false;
        }
        return true;
      });
      return;
    }
    // No operation reject as false
    return false;
  },

  can(role, operation, params) {
    // If not inited then wait until init finishes
    if (!this._inited) {
      return this._init.then(() => {
        return this.can(role, operation, params);
      });
    }

    return new Promise((resolve, reject) => {
      if (typeof role !== 'string') {
        throw new TypeError('Expected first parameter to be string : role');
      }

      if (typeof operation !== 'string') {
        throw new TypeError('Expected second parameter to be string : operation');
      }

      const $role = this.roles[role];

      if (!$role) {
        throw new Error('Undefined role');
      }

      // IF this operation is not defined at current level try higher
      if (!$role.can[operation]) {
        // If no parents reject
        if (!$role.inherits || $role.inherits.length < 1) {
          return reject(new Error('unauthorized'));
        }

        // Return if any parent resolves true or all reject
        return Promise.all(
          $role.inherits.map(parent => {
            return this.can(parent, operation, params)
              .then(() => true)
              .catch(() => false);
          }),
        ).then(result => {
          if (result.some(r => r)) {
            resolve();
          } else {
            reject();
          }
        });
      }

      // We have the operation resolve
      if ($role.can[operation] === 1) {
        return resolve(true);
      }

      // Operation is conditional, run async function
      if (typeof $role.can[operation] === 'function') {
        $role.can[operation](params, function(err, result) {
          if (err) {
            return reject(err);
          }
          if (!result) {
            return reject(new Error('unauthorized'));
          }
          resolve(true);
        });
        return;
      }
      // No operation reject as false
      reject(false);
    });
  },
};
