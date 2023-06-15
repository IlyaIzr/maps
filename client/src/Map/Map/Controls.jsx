import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { TEXT } from '~rest/lang';
import { compassHandler } from "./onMove";
import { setDrawControl as setAppDrawControl } from "../../store/app";

// icons
import { ReactComponent as DrawIcon } from '~rest/svg/draw.svg'
import { ReactComponent as TrashIcon } from '~rest/svg/trash.svg'
import { ReactComponent as CompassIcon } from '~rest/svg/compass.svg'
import { mapAddDrawControl, mapAddGeolocateCtrl, mapAddSearchCtrl } from "./addControl";

const GEOLOCATE_POS = 'top-left'
const SEARCH_POS = 'top-right'
const IS_DEV = import.meta.env.DEV

// TODO remove those seters by moving logic to store
export function Controls({ setFeature, resetRater }) {
  const app = useSelector(state => state.app)
  const map = app.mapRef
  const createBtn = useRef(null);
  const deleteBtn = useRef(null);
  const d = useDispatch()

  /* #region Compass */
  const [compass, setCompass] = useState(false);
  useEffect(() => {
    if (!map) return;
    const removeCompassHandler = compassHandler(map, setCompass)
    return () => removeCompassHandler()
  }, [map])

  function compassClick() {
    const bearing = Math.abs(map.getBearing())
    if (!bearing) return setCompass(false)
    const duration = bearing > 30 ? 1200 : (bearing * 30 + 300)
    map.rotateTo(0, { duration, animate: true })
    setTimeout(() => {
      setCompass(false)
    }, 1500 + duration / 4);
  }
  /* #endregion */

  /* #region Controls */
  const [drawPrompt, setDrawPrompt] = useState(false);
  const [drawControl, setDCLocal] = useState(null)
  function setDrawControl(ctrl) {
    setDCLocal(ctrl)
    setAppDrawControl(d, ctrl)
  }
  const [searchControl, setSearchControl] = useState(null)

  useEffect(() => {
    if (!map) return;
    if (app.mode !== 'draw') {
      if (IS_DEV && searchControl) return;  // avoids app crashing with HMR due to many controls
      if (drawControl) {
        map.removeControl(drawControl)
        setDrawControl(null)
      }
      const control = mapAddSearchCtrl(map, SEARCH_POS)
      setSearchControl(control)
    }

    if (app.mode === 'draw') {
      if (IS_DEV && drawControl) return; // avoids app crashing with HMR due to many controls
      if (searchControl) {
        map.removeControl(searchControl)
        setSearchControl(null)
      }
      const control = mapAddDrawControl(
        map, setFeature, createBtn.current, deleteBtn.current, setDrawPrompt, resetRater
      )
      setDrawControl(control)
    }
  }, [app.mode, map])

  useEffect(() => {
    if (!map) return;
    const { cb } = mapAddGeolocateCtrl(map, GEOLOCATE_POS)
    return () => {
      cb()
    }
  }, [map, mapAddGeolocateCtrl])
  /* #endregion */

  return (
    <>
      {/* Add button */}
      {(app.mode === 'draw') &&
        <button id="createBtn" ref={createBtn} className="mp-bg-light mp-border-accent controlButton">
          <DrawIcon fill="var(--accent)" className="nav-icon" />
        </button>}

      {/* Delete button */}
      {(app.mode === 'draw') &&
        <button id="deleteBtn" ref={deleteBtn} className="mp-bg-light mp-border-accent controlButton">
          <TrashIcon fill="var(--accent)" className="nav-icon" />
        </button>}

      {/* Compass */}
      {(compass && app.mode !== 'draw') &&
        <CompassIcon
          onClick={compassClick}
          fill="var(--secondary)" className="compass-icon mp-bg-light mp-border-secondary cursor-pointer"
        />
      }

      {/* Helper prompt */}
      {(drawPrompt && app.mode === 'draw') && <div className="controlPrompt mp-border-secondary mp-bg-light">
        <h6>{TEXT.drawMode}</h6>
        <p>{TEXT.drawPrompt}</p>
      </div>
      }
    </>
  )
}