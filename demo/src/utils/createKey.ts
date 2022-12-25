const ALL_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';


const pickCharacter = (characters?: string): string => {
  const chars = characters ?? ALL_CHARACTERS
  return chars.charAt(Math.floor(Math.random() * chars.length))
}

const createKey = (keyLength?: number, characters?: string): string => {
  const length = keyLength || 10
  const base = ''

  const arr =  Array
    .from({ length })

  return arr.reduce((acc: string) => `${acc}${pickCharacter(characters)}`, base)
}

export default createKey
