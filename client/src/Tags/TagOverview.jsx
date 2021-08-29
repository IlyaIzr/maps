import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useParams } from "react-router-dom"
import { getTagInfo } from "../requests/tags"
import { TEXT } from "../rest/lang"
import { setMapMode, setToast } from "../store/app"

export const TagOverview = () => {
  const dispatch = useDispatch()
  const { tag } = useParams()
  const [info, setInfo] = useState(null);

  useEffect(() => {
    tagReq()    
    // eslint-disable-next-line 
  }, [])
  async function tagReq() {
    const res = await getTagInfo(tag)
    if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError + ' #tow1' });
    // receive array of tags of buildings
    if (!res.data.length) return;
    const result = { amount: 0, places: [] }
    res.data.forEach(tagObj => {
      result.amount += tagObj.amount
      result.places.push(tagObj.placeId, tagObj.amount)
    })
    setInfo(result)
  }

  if (!info) return null

  function onClick() {
    setMapMode(dispatch, 'tags')
  }

  // should we show tops of the buildings
  return (
    <div className="tagOverview">
      {/* Common info */}
      <h3 className="title"><span>#</span>{info.tag}</h3>
      <p>{TEXT.tagsAmount}: {info.amount}</p>
      <Link to="/">
        <button className="button" onClick={onClick}>{TEXT.watchAtMap}</button>
      </Link>

      {/* Popular buildings */}
      <h4 className="subTitle">{TEXT.mostPopular}</h4>
      {Boolean(info.places.length) && info.places.map(([id, amount]) => {
        return (
          <div className="placeInTag">
            {id}
            <br />
            {amount}
          </div>
        )
      })}

    </div>
  )
}
