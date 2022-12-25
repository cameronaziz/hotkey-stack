import { useEffect, useRef } from "react"
import { entries } from "typed-enumerate"

const useDidChange = <T extends Record<string, any>>(name: string, target: T, ...additional: any[]) => {
  const lastRef = useRef(target)
  const isMountedRef = useRef(false)

  useEffect(() => {
    if (isMountedRef.current) {
      console.log(`Rendered ${name}`)
      entries(target).forEach(([key, value]) => {
        const lastValue = lastRef.current[key]
        if (lastValue !== value) {
          console.group(`${String(key)} Changed`)
          const isObj = typeof value === 'object' || typeof lastValue === 'object'
          if (isObj) {
            console.group('From')
            console.log(lastValue)
            console.groupEnd()
            console.group('To')
            console.log(value)
            console.groupEnd()
          } else {
            console.log(`From: ${lastValue}`)
            console.log(`To: ${value}`)
          }
          console.groupEnd()
        }
      })
    }
    
    lastRef.current = target
    isMountedRef.current = true
  })
}

export default useDidChange
