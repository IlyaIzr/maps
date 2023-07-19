// LayerCard.tsx
import React, { useState } from "react";
import { ReactComponent as CloseIcon } from "~rest/svg/close3.svg";
import { TEXT } from "~rest/lang";
import styles from "./LayerCard.module.css";
import { INITIAL_OPACITY, SOURCE_POSTFIX } from "./settings";

interface LayerCardProps {
  map: any; // Use the appropriate type for the map instance
  layerId: string;
  layerName: string;
  disableLayer: (id: string) => void;
}

export const LayerCard: React.FC<LayerCardProps> = ({
  map,
  layerId,
  layerName,
  disableLayer,
}) => {
  const [opacity, setOpacity] = useState(INITIAL_OPACITY);

  const handleOpacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = parseFloat(event.target.value);
    setOpacity(newOpacity);
  };

  function onInput() {
    map.setPaintProperty(layerId, "raster-opacity", opacity);
  }

  const handleRemoveLayer = () => {
    map.removeLayer(layerId);
    map.removeSource(layerId + SOURCE_POSTFIX);
    disableLayer(layerId);
  };

  return (
    <div className={styles.layerCard} key={layerId}>
      <div className={`${styles.layerHeader} cursor-pointer`}>
        <h3>{layerName}</h3>
        <CloseIcon onClick={handleRemoveLayer} />
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={opacity}
        title={TEXT.layerOpacity}
        onChange={handleOpacityChange}
        onInput={onInput}
        className={styles.opacitySlider}
      />
    </div>
  );
};
