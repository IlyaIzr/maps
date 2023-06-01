import s from './CityItem.module.css'
import { centerOfMass, bbox, getCoords } from '@turf/turf';
import type { GeoJSON } from 'geojson';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TotalRating } from '~components/TotalRating/TotalRating';
import { ZOOM_ON_CITY } from './Cities';
import { setDataToUrl } from '~store/url';
import { useSelector } from 'react-redux';

type ComponentProps = {
  amount: number
  rating: number
  name: string
  geojsonForPreview?: GeoJSON
}


export const CityItem: React.FC<ComponentProps> = ({
  amount,
  rating,
  name,
  geojsonForPreview
}) => {
  const geojson = geojsonForPreview

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [center, setCenter] = useState<number[] | []>([])
  const history = useHistory();
  const mapRef = useSelector(s => s.app.mapRef)

  const toCenter = useCallback(
    () => {
      const lat = +center[0].toFixed(5)
      const lng = +center[1].toFixed(5)
      const zoom = ZOOM_ON_CITY

      setDataToUrl({ lat, lng, zoom })
      history.push(`/?lat=${lat}&lng=${lng}&zoom=${zoom}`)
      mapRef.flyTo({ center: [lat, lng], zoom, speed: 0.8 })
    },
    [geojson, ZOOM_ON_CITY, center],
  )

  useEffect(() => {
    setCenter(centerOfMass(geojson).geometry.coordinates)
  }, [geojson])
  

  // Draw feature shape on canvas
  useEffect(() => {
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
          for (const coordinate of coordinates[0]) {
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
      <div className={s.preview} onClick={toCenter}>
        <canvas className={s.geojsonPreview} ref={canvasRef} />
      </div>
      <div className={s.cityDetails}>
        <h2 className={s.cityName}>{name}</h2>
        <div className={s.cityRating}>
          <TotalRating rating={rating} amount={amount} />
        </div>
      </div>
    </div>
  );
};
