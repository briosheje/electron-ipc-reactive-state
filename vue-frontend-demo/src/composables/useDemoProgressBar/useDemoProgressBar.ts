import { computed } from 'vue';
import { useIpcReactiveState } from '@electron-ipc-reactive-state/ipc-reactive-state-vue';

export const useDemoProgressBar = () => {
  const { state } = useIpcReactiveState<{
    current: number;
    max: number;
  }>('progress-bar-state');

  const current = computed(() => state.value?.current);
  const max = computed(() => state.value?.max);

  return {
    current,
    max,
  };
};
