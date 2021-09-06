import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useHistory, useParams } from "react-router-dom"
import { getTagInfo } from "../requests/tags"
import { TEXT } from "../rest/lang"
import { setMapMode, setToast, tagModeTag } from "../store/app"

export const TagOverview = () => {
  const dispatch = useDispatch()
  const { tag } = useParams()
  const history = useHistory()
  const mapRef = useSelector(s => s.app.mapRef)

  const [info, setInfo] = useState(null);

  useEffect(() => {
    tagReq()
    // eslint-disable-next-line 
  }, [])
  async function tagReq() {
    const res = await getTagInfo(tag)
    console.log('%c⧭', 'color: #00e600', res);
    if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError + ' #tow1' });
    // receive array of tags of buildings
    if (!res.data.length) return;
    const result = { amount: 0, places: [] }
    res.data.forEach(tagObj => {
      result.amount += tagObj.amount
      result.places.push({ ...tagObj })
    })
    setInfo(result)
  }

  if (!info) return null

  function onClick() {
    tagModeTag(dispatch, tag)
    setMapMode(dispatch, 'tags')
    history.push('/')
  }

  // should we show tops of the buildings
  return (
    <div className="tagOverview">
      {/* Common info */}
      <h3 className="title tagWrap"><span className="bigHashtag">#</span>
        <span className="tagContent mp-accent">{tag}</span>
      </h3>
      <p className="subtitle">{TEXT.tagsAmount}: {info.amount}</p>
      <Link to="/">
        <button className="button" onClick={onClick}>{TEXT.watchAtMap}</button>
      </Link>

      {/* Popular buildings */}
      <h4 className="title titlePopular">{TEXT.mostPopularPlaces}</h4>
      <div className="tagPlaces">
        {Boolean(info.places) && info.places.map(({ placeId, amount, name, lng, lat }) => {
          
          function onClick() {
            mapRef.flyTo({ center: [lng, lat], zoom: 16, speed: 0.5 })
            tagModeTag(dispatch, tag)
            setMapMode(dispatch, 'tags')
            history.push('/')
          }
          
          return (<div key={placeId}>
            <div className="placeInTag" >
              <div className="amount mp-accent" title={TEXT.mentionsAmount}>{amount}</div>
              <div className="placeTagInfo">
                <div className="name">{name}</div>
                <button className="button" onClick={onClick}>{TEXT.show}</button>
              </div>
            </div>
          </div>)
        })}
      </div>

    </div>
  )
}
