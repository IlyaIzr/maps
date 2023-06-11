const rangeMax = 20;
const rangeMin = 4;
const zoomMin = 10;
const zoomMax = 16;

export function getRange(zoom) {
  let range;
  if (zoom <= zoomMin) {
    range = rangeMax;
  } else if (zoom >= zoomMax) {
    range = rangeMin;
  } else {
    const interpolationFactor = (zoom - zoomMin) / (zoomMax - zoomMin);
    range = Math.round((rangeMin - rangeMax) * interpolationFactor + rangeMax);
  }

  return range;
}
