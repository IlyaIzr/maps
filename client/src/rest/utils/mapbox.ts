export enum MapboxLayerType {
  Raster = "raster",
  Vector = "vector",
  Fill = "fill",
  Line = "line",
  Composite = 'composite',
  Symbol = "symbol",
  Circle = "circle",
}

export function findFirstIdAfterType(
  type: MapboxLayerType,
  layers: any[]
): string | undefined {
  const startIndex = layers.findIndex((layer) => layer.type === type);
  if (startIndex === -1) return undefined;

  for (let i = startIndex + 1; i < layers.length; i++) {
    if (layers[i].type !== type) {
      return layers[i].id;
    }
  }

  return undefined;
}
