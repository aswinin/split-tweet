'use strict';

function isRemovable(x) {
  return x === null 
      || x === undefined 
      || x === '' 
      || ( Array.isArray(x) && x.length === 0 ) 
      || ( typeof x === 'object' && Object.getOwnPropertyNames(x).length === 0 )
  ;
}

module.exports = { 
  isRemovable,
};
