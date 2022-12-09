/* eslint-disable no-prototype-builtins */
export const deepClone = (obj: any) => {
  if (obj === null) return null
  if (typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  const t = new obj.constructor()
  for (const key in obj) {
    if (obj.hasOwnProperty(key))
      t[key] = deepClone(obj[key])
  }
  return t
}
