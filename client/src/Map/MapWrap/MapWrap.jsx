import { useSelector } from "react-redux";
import { MapArea } from "../Map/Map";
import { Legend } from "../Legend";
import s from "./MapWrap.module.css";
import { FeatureRater } from "../FeatureRater/FeatureRater";
import { LayersControl } from "../LayersControl/LayersControl";

// TODO make separate styles
import "../Map/Maps.css";

export const MapWrap = () => {
  const { mapRef, legendShown } = useSelector((state) => state.app);

  return (
    <div className={s.mainWrapper}>
      <MapArea />
      <LayersControl map={mapRef} />
      {legendShown && <Legend />}
      <FeatureRater />
    </div>
  );
};
