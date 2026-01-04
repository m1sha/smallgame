export function max<T> (items: T[], pred: (item: T)=> number) {
  return Math.max.apply(null, items.map(p => pred(p)))
}
