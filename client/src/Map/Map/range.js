export function getRange(zoom) {
  let range;
  if (zoom <= 10) {
    range = 22;
  } else if (zoom >= 16) {
    range = 5;
  } else {
    const rangeMin = 22;
    const rangeMax = 5;
    const zoomMin = 10;
    const zoomMax = 16;

    const interpolationFactor = (zoom - zoomMin) / (zoomMax - zoomMin);
    range = Math.round((rangeMax - rangeMin) * interpolationFactor + rangeMin);
  }

  return range;
}
