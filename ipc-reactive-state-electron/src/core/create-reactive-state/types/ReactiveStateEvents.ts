export type ReactiveStateEvents<TState = unknown> = {
  onStateUpdateSentToClient: (state: TState) => void;
  onStateUpdateRequestReceived: (state: TState) => void;
  onStateUpdated: (state: TState) => void;
};
