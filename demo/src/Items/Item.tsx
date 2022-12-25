import { hs } from 'hotkey-stack';
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import createKey from '../utils/createKey';
import './Items.css';

type ItemProps = {
  isLastFired: boolean
  setLastFired(item: string): void
  item: RecordedItem
  onRemove(item: string): void
  renderOrder: number
}

export type RecordedItem = {
  id: string
  character: string
}

const Item: FC<ItemProps> = (props) => {
  const { onRemove, isLastFired, setLastFired, item } = props
  const [color, setColor] = useState('blue')
  const [renderId, setRenderId] = useState(createKey(5))
  const [count, setCount] = useState(0)
  const symbolRef = useRef(Symbol())

  useEffect(() => {
    const recentColor = isLastFired ? 'purple' : 'blue'
    setColor(recentColor)
  }, [isLastFired])

  const callback = () => {
    setLastFired(item.id)
    setCount((prev) => prev + 1)
  }
  
  useEffect(() => {
    console.log('adding')
    hs.add(item.character, callback, symbolRef.current)

    return () => {
      hs.skip(callback)
    }
  }, [callback, item.character])

  useEffect(() => {
    return () => {
      hs.pull(callback)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const remove = useCallback(() => {
    onRemove(item.id)
  }, [item.id, onRemove])

  const rerender = useCallback(() => {
    setRenderId(createKey(5))
  }, [])

  const cutLine = useCallback(() => {
    hs.cut(callback)
  }, [callback])

  return (
    <div className="item" style={{ backgroundColor: color }}>
      <div className="item-char">
        {item.character}
         {/* <span className="item-position">Position {renderOrder}</span> */}
      </div>
      <div className="item-count">
        Listener {count}
      </div>
      <div className="item-render-id">Render ID: {renderId}</div>
      <div className="item-button-container">
        <button className="item-button" onClick={remove}>Remove</button>
        <button className="item-button" onClick={rerender}>Rerender</button>
        <button className="item-button" onClick={cutLine}>Cut Line</button>
      </div>
    </div>
  )
}

const propsAreEqual = (prevProps: ItemProps, nextProps: ItemProps) => {
  const { isLastFired, item: { id, character }, renderOrder } = prevProps
  return isLastFired === nextProps.isLastFired
    && id === nextProps.item.id
    && character === nextProps.item.character
    && renderOrder === nextProps.renderOrder
}

export default memo(Item, propsAreEqual)
