export const getPointFromAngle = (
  angle: number,
  x: number,
  y: number,
  distance: number
) => {
  const rad = (angle * Math.PI) / 180;
  return {
    x: x + distance * Math.cos(rad),
    y: y + distance * Math.sin(rad),
  };
};
