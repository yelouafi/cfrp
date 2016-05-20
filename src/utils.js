
let _autoId = 0
export function autoId() {
  return ++_autoId
}

export function eachObj(obj, fn) {
  for(var key in obj) {
    const val = obj[key]
    val !== undefined && fn(val, key)
  }
}

export function check(value, predicate, error) {
  if(!predicate(value)) {
    throw new Error(error)
  }
}

export const is = {
  undef     : v => v === null || v === undefined,
  notUndef  : v => v !== null && v !== undefined,
  function  : f => typeof f === 'function',
  number    : n => typeof n === 'number',
  array     : Array.isArray
}
