import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import mapboxgl from "mapbox-gl";
import { lazily } from "react-lazily";
import { gradients } from "~rest/colors";
import { notNaN } from "~rest/helperFuncs";
import { TEXT } from "~rest/lang";
import { setModal } from "~store/app";
import { Comment } from "../Comment";
import { TotalRating } from "~components/TotalRating/TotalRating";
import { formatGeodata } from "../formatGeodata";
import {
  LAYOUT_ZOOM,
  SELECTED_FEATURE_ID,
  SKIP_AUTH_LOCAL_STORAGE_KEY,
} from "../const";
import {
  getLayoutCoords,
  handleError,
  handleNewLevel,
} from "~rest/helperFuncs";
import { setMapMode } from "~store/app";
import { postReview } from "~requests/reviews";
import { handleRepeatingError } from "../handleRepeatingError";
import { upsertFeatureToAppGeodata } from "~store/map";
import { postTagsIfAny } from "~requests/tags";
import { getPreferences, setPreference } from "~store/localstorage";
import s from "./Rater.module.css";

const { Login } = lazily(() => import("../../Auth/Login"));
const { LayerOpacitySlider } = lazily(() =>
  import("~components/LayerOpacity/LayerOpacitySlider")
);

export const Rater = ({ resetRater }) => {
  const user = useSelector((state) => state.user);
  const { theme, isLogged, mapRef } = useSelector((s) => s.app);
  const feature = useSelector((state) => state.map.currentFeature);
  const gradient = gradients[theme];
  const dispatch = useDispatch();

  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  function onClick() {
    setRating(hover);
  }

  function handleZeroRating(d) {
    if (isZeroRatingEffect(d, rating, sendReview)) return;
    sendReview();
  }

  function onSubmit() {
    if (isAuthorizedEffect(dispatch, isLogged, handleZeroRating)) return;
    handleZeroRating(dispatch);
  }
  function onMouseEnter(e) {
    setHover(Number(e.target.name));
  }
  function onMouseLeave() {
    setHover(rating);
  }

  useEffect(() => {
    setHover(0);
    setRating(0);
    setComment("");
  }, [feature]);

  async function sendReview() {
    setHover(0);
    // Calculations
    const [northEastest, southWestest, polyString] = formatGeodata(
      feature.geometry
    );
    const tempBox = new mapboxgl.LngLatBounds(northEastest, southWestest);
    const { lng, lat } = tempBox.getCenter();
    const { x, y } = getLayoutCoords(lng, lat, LAYOUT_ZOOM);
    // id from props has higher priority. However on first review id only exists at feature.id
    const placeId = feature.properties.id || feature.id;

    // Data to store
    const review = {
      comment,
      grade: notNaN(rating),
      targetId: placeId,
    };
    const place = {
      ...feature.properties,
      lng,
      lat,
      id: placeId,
      name: feature.properties.name || "",
      polyString,
      iso_3166_2: feature.properties.iso_3166_2 || null,
      x,
      y,
    };

    // Go out from mapMode - TODO whatever that means...
    setMapMode(dispatch, null);

    const res = await postReview(
      {
        userId: user.id,
        review,
        place,
        userLevel: user.level,
        commentsNumber: user.commentsn,
      },
      { isNew: !!!feature.properties.id }
    );
    const wasRepeating = handleRepeatingError(dispatch, res);
    if (wasRepeating) return;
    handleError(dispatch, res, "#ppr1");
    handleNewLevel(res, user.commentsn, dispatch);

    if (res.place)
      upsertFeatureToAppGeodata(dispatch, {
        ...feature,
        properties: { ...res.place },
      });
    else console.log("%c⧭ weird error 4214", "color: #514080", res, place);

    const tagReq = await postTagsIfAny({
      user: user.id,
      comment,
      featureId: feature.id || feature.properties.id,
      iso_3166_2: feature.properties.iso_3166_2,
      lng,
      lat,
    });
    handleError(dispatch, tagReq, "#ptg_Main_3");

    resetRater();
  }

  console.log("feature 2", feature, feature.properties.rating);
  // TODO make stars with rating gradient
  return (
    <div className="rater">
      <div
        className={`starsAndRating ${
          feature.properties.rating === undefined ? "noRating" : ""
        }`}
      >
        <div className="stars">
          <h5 className="starRating">{TEXT.yourRating} :</h5>{" "}
          <span className="hoverValue mp-dark">{notNaN(hover)}</span>
          <br />
          {[...Array(5)].map((star, index) => {
            index += 1;
            return (
              <button
                type="button"
                key={index}
                name={index}
                className="starButton"
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                style={
                  index <= (hover || rating)
                    ? { color: gradient[hover] }
                    : { color: gradient[0] }
                }
              >
                <span className="star">&#9733;</span>
              </button>
            );
          })}
        </div>

        {feature.properties.rating !== undefined && (
          <div className={s.ratingWrap}>
            <TotalRating
              rating={feature.properties.rating}
              amount={feature.properties.amount}
            />
            <LayerOpacitySlider
              initialOpacity={getLayerOpacity(SELECTED_FEATURE_ID, mapRef)}
              layerId={SELECTED_FEATURE_ID}
              mapInstance={mapRef}
              propertyToSet={"fill-opacity"}
              className={s.inputWrap}
            />
          </div>
        )}
      </div>

      <Comment comment={comment} setComment={setComment} />

      <div className="raterBtnContainer">
        <button type="button" onClick={onSubmit}>
          {TEXT.send}
        </button>
        {!isLogged && <div className="subtitle">{TEXT.asAnonimus}</div>}
      </div>
    </div>
  );
};

function isZeroRatingEffect(dispatch, rating, acceptAction) {
  if (Number(rating) === 0) {
    setModal(dispatch, {
      message: TEXT.rateZeroModal,
      acceptAction,
      acceptLabel: TEXT.yes,
      cancelLabel: TEXT.goBack,
    });
    return true;
  } else return false;
}

let runtimeSkipCounter = 1;
function isAuthorizedEffect(dispatch, isLogged, next) {
  if (!isLogged && !getPreferences()?.[SKIP_AUTH_LOCAL_STORAGE_KEY]) {
    setModal(dispatch, {
      acceptLabel: null,
      cancelLabel: TEXT.skip,
      cancelAction() {
        // remember on 3rd time
        if (runtimeSkipCounter === 3) {
          setPreference(SKIP_AUTH_LOCAL_STORAGE_KEY, true);
        } else if (runtimeSkipCounter < 3) {
          runtimeSkipCounter++;
        }
        // since both funcions may use same reducer with same dispatch, show after effect on next tick
        setTimeout(() => {
          next(dispatch);
        }, 0);
      },
      message: TEXT.wannaAuthorize,
      children: (
        <div className="auth-modal-containter mp-border-secondary">
          <Suspense fallback={null}>
            <Login afterLoggedIn={next.bind(this, dispatch)} />
          </Suspense>
        </div>
      ),
    });
    return true;
  } else return false;
}

function getLayerOpacity(layerId, map) {
  if (!map?.getLayer(layerId)) {
    console.error(`Layer with ID "${layerId}" not found.`);
    return undefined;
  }

  try {
    const paintProperty = map.getPaintProperty(layerId, "fill-opacity");
    return paintProperty || 0;
  } catch (error) {
    console.error(
      `"fill-opacity" property not found for layer with ID "${layerId}".`,
      error
    );
  }
  return 0;
}
