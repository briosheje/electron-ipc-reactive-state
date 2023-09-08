import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { ReactiveState } from '@briosheje/ipc-reactive-state-electron';

export const useIpcReactiveState = <T extends ReactiveState>(key: string) => {
  const state = ref<T>();
  const unsubscribe =
    ref<ReturnType<(typeof window)['ipcReactiveState']['onStateUpdated']>>();

  const updateState = (newState: T) => {
    window.ipcReactiveState.updateState<T>(key, newState);
  };

  onMounted(() => {
    unsubscribe.value = window.ipcReactiveState.onStateUpdated<T>(key, (v) => {
      state.value = v;
    });

    window.ipcReactiveState.getState<T>(key).then((v) => {
      state.value = v;
    });
  });

  onUnmounted(() => {
    unsubscribe.value?.();
  });

  return {
    state: computed(() => state.value),
    updateState,
  } as const;
};
