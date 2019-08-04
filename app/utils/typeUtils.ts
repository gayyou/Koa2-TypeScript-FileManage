const object_toString = Object.prototype.toString;

export function isUndef(t: any) {
  return typeof t === 'undefined' || t === null;
}

export function isDef(v: any) {
  return v !== undefined && v !== null;
}

export function isPlainObject (obj: any): boolean {
  return object_toString.call(obj) === '[object Object]'
}

export function isRegExp (v: any): boolean {
  return object_toString.call(v) === '[object RegExp]'
}

export function isString (v: any): boolean {
  return typeof v === 'string';
}

export function isNumber (v: any): boolean {
  return typeof v === 'number'
}

export function isArray (v: any): boolean {
  return Array.isArray(v);
}

/**
 * Convert a value to a string that is actually rendered.
 */
export function toString (val: any): string {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === object_toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
export function toNumber (val: string): number | string {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}