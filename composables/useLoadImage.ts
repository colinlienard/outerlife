export const useLoadImage = (source: string) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.src = source;
    image.onload = resolve;
    image.onerror = reject;
  });
