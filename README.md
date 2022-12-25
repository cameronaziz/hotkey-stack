# Hotkey Stack
A package to create a stack of hotkeys.
This allows multiple registrations of the same hotkey.
By default, only the last registration will call it's listener when needed.

## Setup
```bash
yarn add hotkey-stack
```
## Usage
No initialization is required. The package stores its own state. 
> **Note for React Users:**
> There is no provider as `hotkey-stack` is a singleton, does not internally manipulate UI, and stores is own state.
> *That was easy*
```typescript
import { hs } from 'hotkey-stack'

hs.add('a', callback)

// `callback` will execute when the `A` key is pressed.
```
```typescript
import { hs } from 'hotkey-stack'

hs.add('a', oneCallback)
hs.add('a', twoCallback)

// `twoCallback` will execute when the `A` key is pressed.
```
```typescript
import { hs } from 'hotkey-stack'

hs.add('a', oneCallback)
hs.add('a', twoCallback)
hs.pull(twoCallback)

// `oneCallback` will execute when the `A` key is pressed.
```

## API
| Method | Description | Parameters |
| -- | -- | -- |
| `add` | Add a new listener into the stack for the provided hotkey. **Hotkeys are case insensitive.** | `hotkey: string, listener: Listener, symbol?: Symbol` |
| `pull` | Remove a listener from the stack. To prevent all listeners from all hotkeys being removed, provide a second parameter of the hotkey that should be removed. | `listener: Listener, hotkey?: string` |
| `skip` | Remove a listener from the stack but retain place stack. **This requires the symbol to be provided during `add`.** Failure to provide relational symbol will execute `pull` method. To prevent all listeners from all hotkeys being skipped, provide a second parameter of the hotkey that should be skipped. | `listener: Listener, hotkey?: string` |
| `cut` | Moves the listener to the top of the stack. To prevent all listeners from all hotkeys cutting, provide a second parameter of the hotkey that should cut. | `listener: Listener, hotkey?: string` |
| `pause` | Pauses listening to all hotkeys. |  |
| `start` | Starts listening to all hotkeys. *This is automatic during instantiation and does not need to be called.*  |  |

## Advanced Usage
```typescript
import { hs } from 'hotkey-stack'

hs.add('a', oneCallback)
hs.add('a', twoCallback)
hs.skip('a', twoCallback)

// `oneCallback` will execute when the `A` key is pressed.
```
```typescript
import { hs } from 'hotkey-stack'

const oneSymbol = Symbol()

hs.add('a', oneCallback, oneSymbol)
hs.add('a', twoCallback)
hs.skip('a', oneCallback)
hs.add('a', oneCallback, oneSymbol)

// `twoCallback` will execute when the `A` key is pressed.
```
```typescript
import { hs } from 'hotkey-stack'

const oneSymbol = Symbol()

hs.add('a', oneCallback)
hs.add('a', twoCallback)
hs.cut('a', oneCallback)
hs.add('a', oneCallback)

// `oneCallback` will execute when the `A` key is pressed.
```
```typescript
import { hs } from 'hotkey-stack'

const oneSymbol = Symbol()

hs.add('a', oneCallback, oneSymbol)
hs.add('a', twoCallback)
hs.pull('a', oneCallback)
hs.add('a', oneCallback, oneSymbol)

// `oneCallback` will execute when the `A` key is pressed.
// Providing `oneSymbol` has no effect.
```

## React Example
```typescript
  const symbolRef = useRef(Symbol())

  useEffect(() => {
    hotkeyStack.add('a', methodThatCanChange, symbolRef)
 
    return () => {
      // On changes to the listener, `useEffect` will execute return statement.
      // This prevents listener from cutting the line, use `skip`.
      hotkeyStack.skip(methodThatCanChange)
    }
  }, [methodThatCanChange])
 
  useEffect(() => {
    // On component unmount, we want to ensure cleanup.
    hotkeyStack.pull(methodThatCanChange)
  }, [])
```
