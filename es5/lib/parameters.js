'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function isRemovable(x) {
  return x === null || x === undefined || x === '' || Array.isArray(x) && x.length === 0 || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && Object.getOwnPropertyNames(x).length === 0;
}

module.exports = {
  isRemovable: isRemovable
};