import { useCallback, useEffect, useState } from 'react';
import './App.css';
import Controls from './Controls';
import useLocalStorage, { readStorage } from './hooks/useLocalStorage';
import Items from './Items';
import { RecordedItem } from './Items/Item';
import createKey from './utils/createKey';

function App() {
  const [items, setItems] = useState<RecordedItem[]>([])
  const [characters, setCharacters] = useLocalStorage('characters', 'string', 'ABCD')

  useEffect(() => {
    const storage = readStorage('default-count', 'number', 5)
    if (!Number.isNaN(storage)) {
      const length = Number(storage)
      const defaultItems = Array.from({ length }).reduce((acc: RecordedItem[]) => {
        const id = createKey()
        const character = createKey(1, characters)
        acc.push({
          id,
          character,
        })
        return acc
      }, [] as RecordedItem[])

      setItems(defaultItems)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addItem = useCallback(() => {
    setItems((prev) => {
      const id = createKey()
      const character = createKey(1, characters)
      const next = [...prev]
      next.push({
        id,
        character,
      })
      return next
    })
  }, [characters])

  const removeItem = useCallback((removedId: string) => {
    setItems((prev) => {
      return prev.filter((item) => item.id !== removedId)
    })
  }, [])
  
  return (
    <div className="App">
      <Controls characters={characters} setCharacters={setCharacters} addItem={addItem} />
      <Items onRemove={removeItem} items={items} />
    </div>
  );
}

export default App;
