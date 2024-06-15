export function removeItem<T> (items: T[], predicate: ((item: T, index: number) => boolean) | number): void {
  if (typeof predicate === 'number') {
    items.splice(predicate, 1)
    return
  }

  let index = -1
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (predicate(item, i)) {
      index = i
      break
    }
  }
  if (index >= 0) items.splice(index, 1)
}