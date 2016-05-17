
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
