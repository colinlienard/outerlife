export const useThrottle = (
  callback: (...args: any) => void,
  delay: number
): (() => void) => {
  let wait = false;

  return (...args: any) => {
    if (wait) {
      return;
    }

    callback(...args);
    wait = true;

    setTimeout(() => {
      wait = false;
    }, delay);
  };
};
