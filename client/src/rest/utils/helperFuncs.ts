import type {
  BEFeature,
  BEStoredGeometry,
  MapboxFeature,
} from "~rest/types/types";

export function geoJsonFromResponse(places: BEFeature[]) {
  if (!places?.length) return [];

  const geoJson = places.map((placeData) => {
    const coordinates = getCoordsFromBEGeometry(placeData?.polygon);

    const res: MapboxFeature = {
      type: "Feature",
      geometry: {
        type: "MultiPolygon",
        coordinates,
      },
      id: placeData.id,
      properties: {
        rating: Number(placeData.rating),
        amount: placeData.amount,
        name: placeData.name,
        lng: placeData.lng,
        lat: placeData.lat,
        iso_3166_2: placeData.iso_3166_2,
        id: placeData.id,
      },
      source: "composite",
      sourceLayer: "building",
    };

    return res;
  });
  return geoJson;
}

export function getCoordsFromBEGeometry(beGeometry: BEStoredGeometry) {
  const coordinates = beGeometry.map((polygon) =>
    polygon.map((polyFigure) => {
      return polyFigure.map((polygon) => [polygon.x, polygon.y]);
    })
  );
  return coordinates;
}
// export function geoJsonFromCityInfo(places: CityInfo[]) {
//   if (!places?.length) return []

//   const geoJson = places.map(placeData => {
//     const coordinates = getCoordsFromBEGeometry(placeData?.geometry)

//     const res: MapboxFeature = {
//       type: 'Feature',
//       geometry: {
//         type: "MultiPolygon",
//         coordinates
//       },
//       id: placeData.id,
//       properties: {
//         rating: Number(placeData.rating),
//         amount: placeData.amount,
//         name: placeData.name,
//         lng: placeData.lng,
//         lat: placeData.lat,
//         iso_3166_2: placeData.iso_3166_2,
//         id: placeData.id,
//       },
//       source: "composite",
//       sourceLayer: "building",
//     }

//     return res
//   })
//   return geoJson
// }

export function copyToClipboard(text: string): void {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Text copied to clipboard.");
    })
    .catch((error) => {
      console.error("Unable to copy text:", error);
    });
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
