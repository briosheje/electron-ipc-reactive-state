# ElectronIpcReactiveState

[![npm version](https://badge.fury.io/js/@briosheje%2Fipc-reactive-state-electron.svg)](https://badge.fury.io/js/@briosheje%2Fipc-reactive-state-electron)
[![npm version](https://badge.fury.io/js/@briosheje%2Fipc-reactive-state-react.svg)](https://badge.fury.io/js/@briosheje%2Fipc-reactive-state-react)
[![npm version](https://badge.fury.io/js/@briosheje%2Fipc-reactive-state-vue.svg)](https://badge.fury.io/js/@briosheje%2Fipc-reactive-state-vue)

This monorepo contains an implementation of a unidirectional/bidirectional state
handler for electron applications.

The goal is to normalize and simplify the communication between the electron
main process and the renderer process, by allowing them to seamlessly communicate
by removing the need of synchronizing the main process state with the renderer
process state.
