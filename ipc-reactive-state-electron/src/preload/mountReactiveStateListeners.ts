import { contextBridge, ipcRenderer } from 'electron';
import { ReactiveState } from '../core/create-reactive-state/createReactiveIpcState';

declare global {
  interface Window {
    ipcReactiveState: {
      onStateUpdated: ReactiveStateWindowApi['onStateUpdated'];
      updateState: ReactiveStateWindowApi['updateState'];
      getState: ReactiveStateWindowApi['getState'];
    };
  }
}

export type ReactiveStateWindowApi = {
  onStateUpdated: <TState extends ReactiveState>(
    stateUniqueKey: string,
    callback: (state: TState) => void
  ) => () => void;
  updateState: <TState extends ReactiveState>(
    stateUniqueKey: string,
    value: TState
  ) => void;
  getState: <TState extends ReactiveState>(
    stateUniqueKey: string
  ) => Promise<TState>;
};

export const mountReactiveStateListeners = () => {
  contextBridge.exposeInMainWorld('ipcReactiveState', {
    onStateUpdated: <TState extends ReactiveState>(
      stateUniqueKey: string,
      callback: (state: TState) => void
    ) => {
      const ipcKey = `${stateUniqueKey}-updated`;
      const cb: Parameters<(typeof ipcRenderer)['on']>[1] = (_, state) => {
        callback(state);
      };

      ipcRenderer.on(ipcKey, cb);

      return () => {
        ipcRenderer.off(ipcKey, cb);
      };
    },
    updateState: <TState extends ReactiveState>(
      stateUniqueKey: string,
      value: TState
    ) => {
      const ipcKey = `${stateUniqueKey}-update`;

      ipcRenderer.send(ipcKey, value);
    },
    getState: <TState extends ReactiveState>(stateUniqueKey: string) => {
      const ipcKey = `${stateUniqueKey}-get-current-state`;

      return ipcRenderer.invoke(ipcKey) as Promise<TState>;
    },
  } satisfies ReactiveStateWindowApi);
};
