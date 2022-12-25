import { ChangeEvent, FC, useCallback } from 'react';

type CharactersProps = {
  characters: string
  onChange(value: string): void
}

const Characters: FC<CharactersProps> = (props) => {
  const { characters, onChange } = props;

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const result = value.split('').reduce((acc, cur, index) => {
      const current = cur.toUpperCase()
      if (acc.includes(current)) {
        return acc
      }
      return `${acc}${current}`
    }, '')

    onChange(result)
  }, [onChange])

  return (
    <>
      <div className="control-title">
        Characters
      </div>
      <div className="controls-default-count">
        <input
          value={characters}
          onChange={handleChange}
        />
      </div>
    </>
  )
}

export default Characters
