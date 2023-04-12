import { debug as githubDebug } from '@actions/core';

const getPath = (stackString: string, stackIndex: number) =>
  stackString.split('\n')[stackIndex + 1].replace('webpack:/triage/', '').trim().replace('at ', '')

const getLocation = (includeLocation?: boolean): null | string => {
  if (!includeLocation) {
    return null
  }
  const { stack } = new Error('')
  if (!stack) {
    return null
  }


  const here = getPath(stack, 0)
  const match = here.match(/\(([^)]+)\)/)
  const location = match ? match[1] : ''
  const index = location.indexOf('triage/src/log.ts')
  const removal = location.substring(0, index)

  return getPath(stack, 2).replace(removal, '')
}

export const debug = (message: string, includeLocation?: boolean) => {
  const location = getLocation(includeLocation)
  const locationMessage = location === null ? '' : ` at ${location}`
  const fullMessage = ` ${message}${locationMessage}`
  githubDebug(fullMessage)
}
