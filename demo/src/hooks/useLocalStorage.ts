import { useCallback, useState } from "react";
const KEY = 'hotkey-stack::'

export const readStorage =<T extends keyof ParseValueMap>(key: string, parsedType?: T, defaultValue?: ParseValueMap[T]): typeof defaultValue extends undefined ? ParseValueMap[T] | null : ParseValueMap[T] =>
  getStorage(`${KEY}${key}`, parsedType, defaultValue)

const getStorage = <T extends keyof ParseValueMap>(key: string, parsedType?: T, defaultValue?: ParseValueMap[T]): typeof defaultValue extends undefined ? ParseValueMap[T] | null : ParseValueMap[T] => {
  const value = window.localStorage.getItem(key)

  if (value === null) {
    if (typeof defaultValue !== 'undefined') {
      return defaultValue
    }

    const nullValue = null as ParseValueMap[T] | undefined extends undefined ? ParseValueMap[T] | null : ParseValueMap[T]
    return nullValue
  }
  

  switch (parsedType) {
    case 'number':
    case 'boolean':
    case 'object':
      return JSON.parse(value)
    case 'string': 
      return value.replaceAll('"', '') as typeof defaultValue extends undefined ? ParseValueMap[T] | null : ParseValueMap[T]
    default:
      return (value ?? defaultValue ?? null) as typeof defaultValue extends undefined ? ParseValueMap[T] | null : ParseValueMap[T]
  }
}

type SetStorage<T extends keyof ParseValueMap> = (value: ParseValueMap[T] | null) => void
type SetLocalStorage<T extends keyof ParseValueMap> = (value: ParseValueMap[T] | null) => void

type ParseValueMap = {
  number: number
  string: string
  object: Record<string, any>
  boolean: boolean
}

const useLocalStorage = <T extends keyof ParseValueMap>(localStorageKey: string, parsedType?: T, defaultValue?: ParseValueMap[T]):
  [
    typeof defaultValue extends undefined ? ParseValueMap[T] | null : ParseValueMap[T],
    (nextValue: typeof defaultValue extends undefined ? ParseValueMap[T] | null : ParseValueMap[T]) => void
  ] => {
    const key = `${KEY}${localStorageKey}`
    const [localStorage, setValue] = useState(getStorage(key, parsedType, defaultValue))


    const setStorage: SetStorage<T> = useCallback((value) => {
      if (value === null) {
        window.localStorage.removeItem(key)
        return
      }
      
      window.localStorage.setItem(key, JSON.stringify(value))
    }, [key])

    const setLocalStorage: SetLocalStorage<T> = useCallback((value) => {
      const nextValue = (value === null ? defaultValue : value) as typeof defaultValue extends undefined ? ParseValueMap[T] | null : ParseValueMap[T]
      setValue(nextValue)
      setStorage(value)
    }, [defaultValue, setStorage])

    return [localStorage, setLocalStorage]
  }

export default useLocalStorage
