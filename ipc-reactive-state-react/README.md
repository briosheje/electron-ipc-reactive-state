# ipc-reactive-state-react

This library can be used with `@briosheje/ipc-reactive-state-electron` to consume
an electron reactive state created in the main process.

The library offers a hook that subscribes to the state changes given the state key
and returns an immutable copy of the remote state.

# Installation

Install the library using:

```sh
npm i @briosheje/ipc-reactive-state-react --save
```

## Usage

### Prerequisites
You need to have created a state in the main process using `@briosheje/ipc-reactive-state-electron`'s `createReactiveIpcState` function first, and need
to know the state unique key.

### Consuming the state in react
Simply consume the state using the hook.

Example given a state named "my-state" (in typescript):
```ts
type MyState = {
  name: string;
}

const [state, updateRemoteState] = useReactiveState<MyState>('my-state');
```

Calling `updateRemoteState` invokes an ipc call that asks the main process to
update the state. Once updated, the change will be received back by react and
the `state` of the hook will be updated automatically.
