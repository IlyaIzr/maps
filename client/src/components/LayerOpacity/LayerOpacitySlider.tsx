import { useState } from "react";
import { TEXT } from "~rest/lang";
import styles from "./LayerOpacity.module.css";

type Props = {
  layerId: string;
  initialOpacity: number;
  mapInstance: any;
  className?: string
};

export function LayerOpacitySlider({
  layerId,
  initialOpacity,
  mapInstance: map,
  className
}: Props) {
  const [opacity, setOpacity] = useState(initialOpacity);

  const handleOpacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = parseFloat(event.target.value);
    setOpacity(newOpacity);
  };

  function onInput() {
    map.setPaintProperty(layerId, "raster-opacity", opacity);
  }

  return (
    <input
      type="range"
      min={0}
      max={1}
      step={0.01}
      value={opacity}
      title={TEXT.layerOpacity}
      onChange={handleOpacityChange}
      onInput={onInput}
      className={`${styles.opacitySlider} ${className}`}
    />
  );
}
