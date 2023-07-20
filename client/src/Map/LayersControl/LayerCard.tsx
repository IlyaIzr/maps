// LayerCard.tsx
import React, { useState } from "react";
import { ReactComponent as CloseIcon } from "~rest/svg/close3.svg";
import { INITIAL_OPACITY, SOURCE_POSTFIX } from "./settings";
import styles from "./LayerCard.module.css";
import { LayerOpacitySlider } from "~components/LayerOpacity/LayerOpacitySlider";

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
      <LayerOpacitySlider
        initialOpacity={INITIAL_OPACITY}
        layerId={layerId}
        mapInstance={map}
      />
    </div>
  );
};
