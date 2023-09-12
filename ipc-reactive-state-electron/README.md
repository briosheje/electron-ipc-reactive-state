# ipc-reactive-state-electron

This library can be used in conjuction with a compatible frontend adapter (check the last section of this readme)
to implement a one-way or two-way synced state between the electron main process and a react/vue application hosted
in any renderer process(es).

## Installation

Install the library using:

```sh
npm i @briosheje/ipc-reactive-state-electron --save
```

# Usage & Getting started

There are two steps needed to use the library:

- Mounting the preload event handlers and DOM augmentation.
- Creating a state (or more than one state).

## Mounting on preload

Add this in your `preload.js` or `preload.ts` file:
```ts
import { mountReactiveStateListeners } from "@briosheje/ipc-reactive-state-electron"
// or const { mountReactiveStateListeners } = require("@briosheje/ipc-reactive-state-electron")

mountReactiveStateListeners();
```

## Create a reactive state in the main process
### Example with typescript
```ts
import { createReactiveIpcState } from '@briosheje/ipc-reactive-state-electron';

interface MyState = {
  name: string;
  lastName: string;
  age: number;
}

const stateKey = 'my-state';

const initialState: MyState = {
  name: 'Hello',
  lastName: 'World',
  age: 30
};
const { state } = createReactiveIpcState<MyState>(
  stateKey, initialState
);
```

Then, whenever you will change a property to the state object, like:
```ts
state.name = 'Helloooooo';
```

The change will be automatically propagated in electron after 50 milliseconds.
You can change the amount of milliseconds needed to sync the state with the 
third option of the `createReactiveIpcState` function, by providing an object and
specifying the desired throttle.

The throttle was implemented so that sequential changes are batched. As an example, if you
write this:

```ts
state.name = 'Helloooooo';
state.lastName = 'wooooorld';
state.age = 10
```

There will only be one IPC message sent from the main to the renderer processes.

### How to listen to state changes

The `createReactiveIpcState` function returns the state and an EventEmitter.
Such EventEmitter is typed out of box for typescript users and allow to intercept
changes to the state from the client side.

Example:
```ts
import { createReactiveIpcState } from '@briosheje/ipc-reactive-state-electron';

interface MyState = {
  name: string;
  lastName: string;
  age: number;
}

const stateKey = 'my-state';

const initialState: MyState = {
  name: 'Hello',
  lastName: 'World',
  age: 30
};
const { state, events } = createReactiveIpcState<MyState>(
  stateKey, initialState
);

events.on('onStateUpdateRequestReceived', (s) => {
  console.log('client requested to update the state.')
})

events.on('onStateUpdateSentToClient', (s) => {
  console.log('A change propagated in the main process was sent to renderer processes.')
})

events.on('onStateUpdated', (s) => {
  console.log('A change requested to update the state was applied to the state.')
})
```

### How do I use the library on the client side?

You can use one of the adapters available:

- Vanilla: coming soon
- Vue: `@briosheje/ipc-reactive-state-vue`
- React: `@briosheje/ipc-reactive-state-angular`
- Solid JS: coming soon
- Svelte: coming soon
- Angular: coming soon
- Qwik: coming soon
