import { BrowserWindow, ipcMain } from 'electron';
import { EventEmitter } from 'events';
import type TypedEmitter from 'typed-emitter';

import { ReactiveStateEvents } from './types/ReactiveStateEvents';
import { throttle } from '../../utils/throttle';

export const registeredStates = new Map<
  string,
  ReturnType<typeof createReactiveIpcState>
>();

export type ReactiveState = Record<PropertyKey, unknown>;

export type CreateReactiveIpcStateOpts = {
  throttleInMilliseconds?: number;
};
export const createReactiveIpcState = <T extends ReactiveState>(
  stateUniqueKey: string,
  initialState: T,
  { throttleInMilliseconds = 50 }: CreateReactiveIpcStateOpts = {}
) => {
  if (registeredStates.has(stateUniqueKey)) {
    throw `Key ${stateUniqueKey} is already registered`;
  }

  let rawState: T = { ...initialState };
  const em = new EventEmitter() as TypedEmitter<ReactiveStateEvents>;

  const stateProxy = Object.assign(
    {},
    {
      get() {
        return rawState;
      },
      set(v: T) {
        rawState = v;
      },
    }
  );

  const updateState = () => {
    BrowserWindow.getAllWindows().forEach((w) => {
      w.webContents.send(`${stateUniqueKey}-updated`, stateProxy.get());
    });
    em.emit('onStateUpdateSentToClient', stateProxy.get());
  };
  const throttleUpdateState = throttle(updateState, throttleInMilliseconds);

  const p = new Proxy(
    { ...initialState },
    {
      set: (_, property, value) => {
        const currentState = stateProxy.get();
        currentState[property as keyof T] = value;
        throttleUpdateState();

        return true;
      },
      get: (_, property) => {
        return stateProxy.get()[property as keyof T];
      },
    }
  );

  ipcMain.on(`${stateUniqueKey}-update`, (_, value) => {
    em.emit('onStateUpdateRequestReceived', value);
    stateProxy.set(value);
    em.emit('onStateUpdated', stateProxy.get());

    throttleUpdateState();
  });

  ipcMain.handle(`${stateUniqueKey}-get-current-state`, () => {
    return stateProxy.get();
  });

  const result = { state: p, events: em } as const;
  registeredStates.set(stateUniqueKey, result);

  return result;
};
