# ipc-reactive-state-vue

This library can be used with `@briosheje/ipc-reactive-state-electron` to consume
an electron reactive state created in the main process.

The library offers a composable that subscribes to the state changes given the state key
and returns an immutable copy of the remote state.

## Compatibility

This library is meant to be used with Vue 3, there currently is no plan to make
it compatible with older versions of Vue.

If you believe this is useful for you to have it working in Vue 2, please open
an issue.

## Installation

Install the library using:

```sh
npm i @briosheje/ipc-reactive-state-vue --save
```

## Usage

### Prerequisites
You need to have created a state in the main process using `@briosheje/ipc-reactive-state-electron`'s `createReactiveIpcState` function first, and need
to know the state unique key.

### Consuming the state in vue
Simply consume the state using the composable.

Example given a state named "my-state" (in typescript):
```ts
<script setup lang="ts">
import { useIpcReactiveState } from '@briosheje/ipc-reactive-state-vue'

type MyState = {
  name: string;
}

const { state, updateState } = useIpcReactiveState<MyState>('my-state');
</script>
```

Calling `updateState` invokes an ipc call that asks the main process to
update the state. Once updated, the change will be received back by react and
the `state` of the hook will be updated automatically.
