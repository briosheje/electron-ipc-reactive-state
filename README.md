# ElectronIpcReactiveState

This monorepo contains an implementation of a unidirectional/bidirectional state
handler for electron applications.

The goal is to normalize and simplify the communication between the electron
main process and the renderer process, by allowing them to seamlessly communicate
by removing the need of synchronizing the main process state with the renderer
process state.
