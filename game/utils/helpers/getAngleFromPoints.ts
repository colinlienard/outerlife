export const getAngleFromPoints = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  let radian = Math.atan2(y1 - y2, x1 - x2);
  if (radian < 0) {
    radian += Math.PI * 2;
  }
  return (radian * 180) / Math.PI;
};
