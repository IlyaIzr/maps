import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import { featuredTags } from "~requests/tags"
import { TEXT } from "~rest/lang"
import { setToast } from "~store/app"
import { TagItem } from "./TagItem"

export const FeaturedTags = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [recent, setRecent] = useState([])
  const [popular, setPopular] = useState([])

  useEffect(() => {
    (async function () {
      const res = await featuredTags()
      if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError + ' #fts1' });
      setRecent(res.data.recent)
      setPopular(res.data.popular)
    })()
    // eslint-disable-next-line 
  }, [])

  function onClick(tag) {
    history.push(`/tags/item/${tag}`)
  }

  return (
    <div>
      <h4 className="title">{TEXT.recentTags}</h4>
      <div className="tagsGroup">

        {Boolean(recent.length) && recent.map(tagInfo => {
          return <TagItem tagInfo={tagInfo} key={tagInfo.tag + 'recent'} onClick={onClick} />
        })}
      </div>

      <h4 className="title">{TEXT.mostPopular}</h4>
      <div className="tagsGroup">

        {Boolean(popular.length) && popular.map(tagInfo => {
          return <TagItem tagInfo={tagInfo} key={tagInfo.tag + 'popular'} onClick={onClick} />
        })}
      </div>

    </div>
  )
}
