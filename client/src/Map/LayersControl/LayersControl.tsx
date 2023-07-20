// LayersControl.tsx
import React, { useState } from "react";
import { LayerCard } from "./LayerCard";
import { ReactComponent as LayersIcon } from "~rest/svg/layersIcon.svg";
import { INITIAL_OPACITY, layersToAdd, SOURCE_POSTFIX } from "./settings";
import { TEXT } from "~rest/lang";
import { delay } from "~rest/utils/helperFuncs";

import styles from "./LayersControl.module.css";

const singleLayer = layersToAdd.length === 1;

interface LayersControlProps {
  map: any; // Use the appropriate type for the map instance
}

export const LayersControl: React.FC<LayersControlProps> = ({ map }) => {
  const [enabledLayers, setEnbledLayers] = useState<typeof layersToAdd>([]);
  function disableLayer(id: string) {
    setEnbledLayers((layers) => {
      return layers.filter((l) => l.id !== id);
    });
  }

  // Refactor seems obvious if more layers will be added
  const addingLayers = async () => {
    if (singleLayer) {
      const layer = layersToAdd[0];
      setEnbledLayers([layer]);
      // Why? Because i like it that way
      await delay(500);

      const sourceName = `${layer.id}${SOURCE_POSTFIX}`;
      map.addSource(sourceName, {
        type: layer.type,
        tiles: layer.tiles,
        tileSize: layer.tileSize,
      });

      map.addLayer(
        {
          id: layer.id,
          type: "raster",
          source: sourceName,
          minzoom: layer.minzoom,
          maxzoom: layer.maxzoom,
          paint: {
            "raster-opacity": INITIAL_OPACITY,
          },
        },
        layer.mountBeforeId
      );
    }
  };

  function handleControlClick() {
    if (!enabledLayers.length) return addingLayers();
  }

  const title: string = singleLayer ? layersToAdd[0].name : TEXT.addLayer;

  return (
    <div
      onClick={handleControlClick}
      className={`${styles.layersControl} ${
        enabledLayers.length ? styles.active : styles.disabled
      } 
      mp-shadow-light mp-bg-light mp-border-secondary border1pxSolid cursor-pointer transition`}
      title={enabledLayers.length ? title : undefined}
    >
      {enabledLayers.length ? (
        <div className={styles.layerCards}>
          {enabledLayers &&
            enabledLayers.map((layer) => (
              <LayerCard
                map={map}
                layerId={layer.id}
                layerName={layer.name}
                disableLayer={disableLayer}
                key={layer.id}
              />
            ))}
        </div>
      ) : (
        <div className={styles.iconWrap}>
          <LayersIcon className="transition" />
        </div>
      )}
    </div>
  );
};
