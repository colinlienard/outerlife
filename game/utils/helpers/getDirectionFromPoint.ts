export const getDirectionFromPoint = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const angle = (Math.atan2(x1 - x2, y1 - y2) * 180) / Math.PI;

  if (angle > -45 && angle < 45) {
    return 'down';
  }
  if (angle > 45 && angle < 135) {
    return 'right';
  }
  if (angle > 135 || angle < -135) {
    return 'up';
  }
  return 'left';
};
