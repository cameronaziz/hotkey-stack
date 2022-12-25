import { ChangeEvent, FC, useCallback } from 'react';

type DefaultItemsProps = {
  count: number
  onChange(value: number): void
}

const cleanValue = (value: string): string => {
  const needsCleaning = value.length > 1 && value !== '0' && value.startsWith('0')

  if (needsCleaning) {
    return cleanValue(value.slice(1))
  }
  return value
}

const DefaultItems: FC<DefaultItemsProps> = (props) => {
  const { count, onChange } = props;

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const cleanedValue = cleanValue(value)
    const isNaN = Number.isNaN(cleanedValue)
    if (isNaN) {
      return
    }
    const number = Number(cleanedValue)
    onChange(number)

  }, [onChange])

  return (
    <>
    <div className="control-title">
      Default Items
    </div>
    <div className="control-value">
      <input
        type="number"
        value={count}
        onChange={handleChange}
      />
    </div>
    </>
  )
}

export default DefaultItems
