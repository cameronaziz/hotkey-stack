import { FC, useCallback, useState } from 'react';
import Item, { RecordedItem } from './Item';
import './Items.css';

type ItemsProps = {
  items: RecordedItem[]
  onRemove(item: string): void
}

const Items: FC<ItemsProps> = props => {
  const { items, onRemove } = props
  const [lastFired, setLastFiredItem] = useState<string | null>(null)
  
  const setLastFired = useCallback((value: string | null) => {
    setLastFiredItem(value)
  }, [])
 
  const remove = useCallback((item: string) => {
    onRemove(item)
    setLastFired(null)
  }, [onRemove, setLastFired])


  return (
    <div className="items">
      {items.map((item, index) => (
        <Item
          onRemove={remove}
          key={item.id}
          item={item}
          renderOrder={index + 1}
          isLastFired={lastFired === item.id}
          setLastFired={setLastFired}
        />
      ))}
    </div>
  );
};

export default Items;
