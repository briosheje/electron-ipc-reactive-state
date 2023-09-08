import {
  ReactiveState,
  createReactiveIpcState,
} from '@briosheje/ipc-reactive-state-electron';

export interface ProgressBarState extends ReactiveState {
  current: number;
  max: number;
}
export const PROGRESS_BAR_STATE_IPC_KEY = 'progress-bar-state';

export const progressBarState = createReactiveIpcState<ProgressBarState>(
  PROGRESS_BAR_STATE_IPC_KEY,
  {
    current: 0,
    max: 100_000,
  },
  {
    throttleInMilliseconds: 0,
  }
);

export const startFakeProgressBar = () => {
  const { state } = progressBarState;

  const interval = setInterval(() => {
    state.current++;
    if (state.current >= state.max) {
      clearInterval(interval);
    }
  }, 10);
};
