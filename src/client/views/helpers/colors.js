export function colorMoney (x) {
  return x < 0 ? '#933' : '#393'
}

function hashCode (str) {
  return str
    .split('')
    .reduce((hash, c) => hash * 31 + c.charCodeAt(0) | 0, 0)
}

export function hashHSL (str, s, l) {
  const hash = Math.abs(hashCode(str))
  let h = hash % 360
  return 'hsl(' + h + ',' + s + ',' + l + ')'
}
