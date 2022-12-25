import { FC, useCallback, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import Characters from './Characters';
import './Controls.css';
import DefaultItems from './DefaultItems';

type ControlsProps = {
  addItem(): void
  characters: string
  setCharacters(characters: string): void
}

const Controls: FC<ControlsProps> = props => {
  const { addItem, setCharacters, characters } = props
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [defaultCount, setDefaultCount] = useLocalStorage('default-count', 'number', 5)

  const onClick = useCallback(() => {
    addItem()
    const { current } = inputRef
    if (current) {
      current.focus()
    }
  }, [addItem])

  return (
    <div className="controls-container">
      <div className="controls-settings">
        <DefaultItems
          count={defaultCount}
          onChange={setDefaultCount}
        />
        <Characters
          characters={characters}
          onChange={setCharacters}
        />
      </div>
      <button className="controls-add" onClick={onClick}>Add Item</button>
    </div>
  );
};

export default Controls;
