'use client';

import { useDemoProgressBar } from '../../hooks/useDemoProgressBar';

export const DemoProgressBar = () => {
  const progressBarState = useDemoProgressBar();

  if (!progressBarState) {
    return <span>Progress bar did not yet start</span>;
  }

  return (
    <>
      <progress max={progressBarState.max} value={progressBarState.current} />
      current progress is {progressBarState.current} on {progressBarState.max}
    </>
  );
};
