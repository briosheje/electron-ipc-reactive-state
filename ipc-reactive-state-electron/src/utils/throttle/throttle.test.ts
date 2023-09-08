import { throttle } from './throttle';

// Mocking setTimeout and clearTimeout for testing
jest.useFakeTimers();

describe('throttle', () => {
  it('should throttle the function call', () => {
    const mockAction = jest.fn();
    const throttledAction = throttle(mockAction, 100);

    throttledAction();
    throttledAction();

    // Fast-forward time by 100ms
    jest.advanceTimersByTime(100);

    expect(mockAction).toHaveBeenCalledTimes(1);

    throttledAction();

    // Fast-forward time by 100ms
    jest.advanceTimersByTime(100);

    expect(mockAction).toHaveBeenCalledTimes(2);

    // Fast-forward time by another 100ms
    jest.advanceTimersByTime(100);

    expect(mockAction).toHaveBeenCalledTimes(2);
  });

  it('should pass arguments to the throttled function', () => {
    const mockAction = jest.fn();
    const throttledAction = throttle(mockAction, 100);

    throttledAction(1, 'abc');
    throttledAction(2, 'def');

    // Fast-forward time by 100ms
    jest.advanceTimersByTime(100);

    expect(mockAction).toHaveBeenCalledWith(2, 'def');
  });
});
