import { ReactiveState } from '@briosheje/ipc-reactive-state-electron';

export interface SharedState extends ReactiveState {
  counter: number;
}
export const SHARED_STATE_IPC_KEY = 'shared-state';
