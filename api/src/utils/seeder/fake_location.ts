export const setLocation = (
  latMin: number,
  latMax: number,
  longMin: number,
  longMax: number
) => {
  const latitude = Math.random() * (latMax - latMin) + latMin;
  const longitude = Math.random() * (longMax - longMin) + longMin;
  const localisation = {
    x: longitude,
    y: latitude,
  };
  return localisation;
};
