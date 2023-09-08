import { useReactiveState } from '@briosheje/ipc-reactive-state-react';

export const useDemoProgressBar = () => {
  const [state] = useReactiveState<{
    current: number;
    max: number;
  }>('progress-bar-state');

  return state;
};
