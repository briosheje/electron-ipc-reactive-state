import { app, BrowserWindow } from 'electron';
import { join } from 'path';

import { createReactiveIpcState } from '@briosheje/ipc-reactive-state-electron';

import { SHARED_STATE_IPC_KEY, SharedState } from './examples/SharedState';
import { startFakeProgressBar } from './examples/progress-bar/ProgressBarState';

const frontendUrl = process.env.NX_FRONTEND_URL;

if (!frontendUrl) {
  throw 'frontend url not specified. Terminating.';
}

const createWindow = () => {
  const preloadPath = join(__dirname, 'preload.js');
  const { state } = createReactiveIpcState<SharedState>(
    SHARED_STATE_IPC_KEY,
    {
      counter: 0,
    },
    {
      throttleInMilliseconds: 50,
    }
  );

  startFakeProgressBar();

  setInterval(() => {
    state.counter++;
  }, 1000);

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: preloadPath,
    },
  });

  win.loadURL(frontendUrl);
};

app.whenReady().then(() => {
  createWindow();
});
