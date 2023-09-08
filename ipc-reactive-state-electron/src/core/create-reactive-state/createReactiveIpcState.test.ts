import { ipcMain } from 'electron';
import { EventEmitter } from 'events';
import { faker } from '@faker-js/faker';

import { createReactiveIpcState } from './createReactiveIpcState';

// Mock dependencies
jest.mock('electron', () => ({
  BrowserWindow: {
    getAllWindows: jest.fn(() => []),
  },
  ipcMain: {
    on: jest.fn(),
    handle: jest.fn(),
  },
}));

const mockIpcMainMessageReceived = (key: string, ...values: unknown[]) => {
  const [, eventHandler] = (ipcMain.on as jest.Mock).mock.calls.find(
    (call) => call[0] === key
  );
  eventHandler(undefined, ...values);
};

describe('createReactiveIpcState', () => {
  it('should create a reactive state', () => {
    const initialState = { prop1: 'value1', prop2: 'value2' };
    const testKey = faker.string.uuid();
    const { state, events } = createReactiveIpcState(testKey, initialState);

    // Assertions
    expect(state).toEqual(initialState);
    expect(events).toBeInstanceOf(EventEmitter);
  });

  it('should throw if the key is already registered', () => {
    const initialState = { prop1: 'value1', prop2: 'value2' };
    const testKey = faker.string.uuid();
    createReactiveIpcState(testKey, initialState);

    // Assertions
    expect(() => createReactiveIpcState(testKey, initialState)).toThrow(
      `Key ${testKey} is already registered`
    );
  });

  it('Should allow to retrieve an existing state by key', async () => {
    const initialState = { prop1: 'value1', prop2: 'value2' };
    const testKey = faker.string.uuid();
    const state = createReactiveIpcState(testKey, initialState);

    const { registeredStates } = await import('./createReactiveIpcState');

    expect(registeredStates.has(testKey)).toBe(true);
    expect(registeredStates.get(testKey)).toEqual(state);
  });

  it('should update the state correctly', () => {
    const initialState = { prop1: 'value1', prop2: 'value2' };
    const testKey = faker.string.uuid();
    const { state } = createReactiveIpcState(testKey, initialState);

    // Update a property in the state
    state.prop1 = 'newvalue1';

    // Assertions
    expect(state).toEqual({ prop1: 'newvalue1', prop2: 'value2' });
  });

  it('should notify if the state gets updated from the client', () => {
    const initialState = { prop1: 'value1', prop2: 'value2' };
    const testKey = faker.string.uuid();
    const { events } = createReactiveIpcState(testKey, initialState);

    const cb = jest.fn();
    events.on('onStateUpdated', (s) => cb(s));

    // Simulate an ipc main call
    mockIpcMainMessageReceived(`${testKey}-update`, {
      prop1: 'newvalue1',
      prop2: 'value2',
    });

    // Assertions
    expect(cb).toHaveBeenCalledWith({
      prop1: 'newvalue1',
      prop2: 'value2',
    });
  });
});
