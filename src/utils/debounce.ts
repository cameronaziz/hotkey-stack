function debounce<T extends (...args: any[]) => any>(this: T, func: T, timeout?: number): T {
  const timeoutLength = typeof timeout === 'undefined' ? 100 : timeout
  let timer: NodeJS.Timeout


  return ((...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeoutLength)
  }) as T
}

export default debounce
