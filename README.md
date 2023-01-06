# Hotkey Stack

<img style="max-width: 400px; margin: 0 auto; display: block;" src="assets/images/stacks.png" />
A zero dependency package to create a stack of listeners for a hotkey.
This allows multiple registrations of the same hotkey.
By default, only the last registered listener will be called when it's hotkey is pressed.

## Setup

### NPM

```bash
npm install hotkey-stack
```

### Yarn

```bash
yarn add hotkey-stack
```

## Usage

### Basic

```typescript
import hs from "hotkey-stack";

const callback = () => {
  console.log("Callback Called");
};

hs.add("a", callback);
```

#### Output when `A` key is pressed

```bash
Callback Called
```

### Multiple Listeners

```typescript
import hs from "hotkey-stack";

const oneCallback = () => {
  console.log("One Callback Called");
};

const twoCallback = () => {
  console.log("Two Callback Called");
};

hs.add("a", oneCallback);
hs.add("a", twoCallback);
```

#### Output when `A` key is pressed

```bash
Two Callback Called
```

### Removing Listeners

```typescript
import hs from "hotkey-stack";

const oneCallback = () => {
  console.log("One Callback Called");
};

const twoCallback = () => {
  console.log("Two Callback Called");
};

hs.add("a", oneCallback);
hs.add("a", twoCallback);
hs.pull(twoCallback);
```

#### Output when `A` key is pressed

```bash
One Callback Called
```

## Hotkey Config

Most API functions receive a `HotkeyConfig` which is either a `string` or `HotkeyComboConfig`.
The `HotkeyComboConfig` has the following properties:

|     Property      |   Type    | Required | Description                                                                                                            |
| :---------------: | :-------: | :------: | ---------------------------------------------------------------------------------------------------------------------- |
|       `key`       | `string`  |   Yes    | Key from `KeyboardEvent` to be listened to.                                                                            |
| `isMetaRequired`  | `boolean` |    No    | If `true`, meta key must be pressed. On Windows, this is the Windows Key (`⊞`). On Mac, this is the Command Key (`⌘`). |
| `isShiftRequired` | `boolean` |    No    | If `true`, the shift key must be pressed.                                                                              |
| `isCtrlRequired`  | `boolean` |    No    | If `true`, the ctrl key must be pressed.                                                                               |
|  `isAltRequired`  | `boolean` |    No    | If `true`, the alt key must be pressed.                                                                                |

## API

| Method  | Description                                                                                                                                                                                                                                                                                                   | Parameters                                            |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `add`   | Add a new listener into the stack for the provided hotkey. **Hotkeys are case insensitive.**                                                                                                                                                                                                                  | `hotkey: string, listener: Listener, symbol?: Symbol` |
| `pull`  | Remove a listener from the stack. To prevent all listeners from all hotkeys being removed, provide a second parameter of the hotkey that should be removed.                                                                                                                                                   | `listener: Listener, hotkey?: string`                 |
| `skip`  | Remove a listener from the stack but retain place stack. **This requires the symbol to be provided during `add`.** Failure to provide relational symbol will execute `pull` method. To prevent all listeners from all hotkeys being skipped, provide a second parameter of the hotkey that should be skipped. | `listener: Listener, hotkey?: string`                 |
| `cut`   | Moves the listener to the top of the stack. To prevent all listeners from all hotkeys cutting, provide a second parameter of the hotkey that should cut.                                                                                                                                                      | `listener: Listener, hotkey?: string`                 |
| `pause` | Pauses listening to all hotkeys.                                                                                                                                                                                                                                                                              |                                                       |
| `start` | Starts listening to all hotkeys. _This is automatic during instantiation and does not need to be called._                                                                                                                                                                                                     |                                                       |

## Advanced Usage

### Disabling Listener

The listener stack
Listeners can be temporaily

```typescript
import hs from "hotkey-stack";

const oneCallback = () => {
  console.log("One Callback Called");
};

const twoCallback = () => {
  console.log("Two Callback Called");
};

hs.add("a", oneCallback);
hs.add("a", twoCallback);
hs.skip("a", twoCallback);
```

#### Output when `A` key is pressed

```bash
One Callback Called
```

### Disabling Listener and Adding Back

This example uses `skip`, and then `add`.
This **does not** require the listener to be the same reference.
The symbol passed to `add` will be used as the reference to retain the position.

```typescript
import hs from "hotkey-stack";

const oneSymbol = Symbol();

const oneCallback = () => {
  console.log("One Callback Called");
};

const twoCallback = () => {
  console.log("Two Callback Called");
};

hs.add("a", oneCallback, oneSymbol);
hs.add("a", twoCallback);
hs.skip("a", oneCallback);
hs.add("a", oneCallback, oneSymbol);
```

#### Output when `A` key is pressed

```bash
Two Callback Called
```

### Prioritizing Listener

```typescript
import hs from "hotkey-stack";

const oneCallback = () => {
  console.log("One Callback Called");
};

const twoCallback = () => {
  console.log("Two Callback Called");
};

hs.add("a", oneCallback);
hs.add("a", twoCallback);
hs.cut("a", oneCallback);
```

#### Output when `A` key is pressed

```bash
One Callback Called
```
