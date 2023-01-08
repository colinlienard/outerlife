export const getDegreeFromRadian = (r: number) => {
  let radian = r;
  if (radian < 0) {
    radian += Math.PI * 2;
  }
  return (radian * 180) / Math.PI;
};
