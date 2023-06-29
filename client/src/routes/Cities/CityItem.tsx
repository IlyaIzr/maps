import s from './CityItem.module.css'
import { bbox, getCoords, multiPolygon } from '@turf/turf';
import type { GeoJSON } from 'geojson';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TotalRating } from '~components/TotalRating/TotalRating';
import { ZOOM_ON_CITY } from './Cities';
import { setDataToUrl } from '~store/url';
import { useSelector } from 'react-redux';
import { CityInfo } from '~requests/cities';
import { DOCUMENT_LANG } from '~rest/lang'
import { getCoordsFromBEGeometry } from '~rest/utils/helperFuncs';


export const CityItem: React.FC<CityInfo> = ({
  amount,
  rating,
  en,
  ru,
  lat, 
  lng,
  geometry
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // The center functionality might be used as a separate button
  // const [center, setCenter] = useState<number[] | []>([])
  const [geojson, setGeojson] = useState<GeoJSON | null>(null)
  const history = useHistory();
  const mapRef = useSelector(s => s.app.mapRef)

  const toCityFeature = useCallback(
    () => {
      // const lat = +center[0].toFixed(5)
      // const lng = +center[1].toFixed(5)
      const zoom = ZOOM_ON_CITY

      console.log('%c⧭', 'color: #e50000', { lat, lng });
      setDataToUrl({ lat, lng, zoom })
      history.push(`/?lat=${lat}&lng=${lng}&zoom=${zoom}`)
      mapRef.flyTo({ center: [lng, lat], zoom, speed: 0.8 })
    },
    [ZOOM_ON_CITY],
  )

  useEffect(() => {
    if (geometry) {
      const geojson = multiPolygon(getCoordsFromBEGeometry(geometry))
      setGeojson(geojson)
      // setCenter(centerOfMass(geojson).geometry.coordinates)
    }
  }, [geometry])


  // Draw feature shape on canvas
  // TODO make render geojson separate component
  useEffect(() => {
    if (!geojson) return
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Convert GeoJSON coordinates to pixel coordinates on the canvas
        const bounds = bbox(geojson);
        const xRange = bounds[2] - bounds[0];
        const yRange = bounds[3] - bounds[1];
        const xScale = canvas.width / xRange;
        const yScale = canvas.height / yRange;

        // Draw the GeoJSON shape on the canvas
        const fillColor = getComputedStyle(document.querySelector('html')!).getPropertyValue('--secondary');
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        const coordinates = getCoords(geojson);
        if (Array.isArray(coordinates)) {
          for (const coordinate of coordinates[0][0]) {
            const x = (coordinate[0] - bounds[0]) * xScale;
            const y = canvas.height - (coordinate[1] - bounds[1]) * yScale;
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.fill();
      }
    }
  }, [geojson, canvasRef]);


  return (
    <div className={s.cityItem}>
      <div className={s.preview} onClick={toCityFeature}>
        <canvas className={s.geojsonPreview} ref={canvasRef} />
      </div>
      <div className={s.cityDetails}>
        <h2 className={s.cityName}>{DOCUMENT_LANG === 'ru' ? ru : en}</h2>
        <div className={s.cityRating}>
          <TotalRating rating={rating} amount={amount} />
        </div>
      </div>
    </div>
  );
};
