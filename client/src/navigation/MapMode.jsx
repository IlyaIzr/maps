import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { TEXT } from '../rest/lang'
import { friendModeId, hideMain, setMapMode } from '../store/app'
import { getMapModeLabel } from './NavMain'
import { ReactComponent as DrawIcon } from '../rest/svg/draw.svg'

export const MapMode = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { friends } = useSelector(s => s.user)
  const app = useSelector(s => s.app)


  const [modeLabel, setModeLabel] = useState(TEXT.defaultMode)

  useEffect(() => {
    (function () {
      const label = getMapModeLabel(app, friends)
      return setModeLabel(label)
    })()
    // eslint-disable-next-line
  }, [app.mode, app.friendModeId, app.tagModeTag])

  useEffect(() => {
    hideMain(dispatch)
    // eslint-disable-next-line
  }, [])

  function runFriendMode(id) {
    history.push('/')
    friendModeId(dispatch, id)
    setMapMode(dispatch, 'watch')
  }

  function reset() {
    history.push('/')
    setMapMode(dispatch, 'default')
  }

  function runDrawMode() {
    history.push('/')
    setMapMode(dispatch, 'draw')
  }

  return (
    <div className="modeSwitch">

      <h5 className="currentMode">{TEXT.currentMode + ': '}
        <span className="mp-counter">
          {modeLabel}
        </span>
      </h5>

      {/* friendMode */}
      <div className="modeType mp-border-secondary">
        <h5 className="title">{TEXT.watchModeSub1}</h5>
        <div className="friendList">
          {Boolean(friends?.length) ? friends.map(user => {
            return (
              <div className="friendContainer" key={user.id1 + user.id2}>
                <div className="resultUser cursor-pointer mp-accent-hover transition-small"
                  key={user.id} onClick={() => runFriendMode(user.id)}
                >

                  <div className="authorLogo mp-bg-secondary">
                    <span className="mp-dark" title={user.login}>{String(user.name)?.[0]?.toUpperCase()}</span>
                  </div>

                  <div className="resultUser-creds">
                    <p className="mp-secondary">{user.name}</p>
                    <label className="cursor-pointer">({user.login})</label>
                  </div>
                </div>
              </div>
            )
          }) :
            <div className="noFriendsCase">
              <h5>{TEXT.watchModeSub2}</h5>
              <Link to="/friends">
                <button>{TEXT.addFriends}</button>
              </Link>
            </div>}
        </div>
      </div>

      {/* drawMode */}
      {app.mode !== 'draw' &&
        <div className="modeType mp-border-secondary">
          <h5 className="title">{TEXT.drawMode}</h5>
          <Link to="/">
            <button className="button modeButton drawModeButton" onClick={runDrawMode}>
              <DrawIcon fill="var(--secondary)" className="nav-icon"/>
              {TEXT.toDrawMode}
            </button>
          </Link>
          <p className="subtitle">{TEXT.watchModeSub3}</p>
        </div>
      }

      {/* tagMode */}
      <div className="modeType mp-border-secondary">{app.tagModeTag ?
        <div>
          <h5 className="title">
            <span className="capitalize">{TEXT.tag + ': '}</span>
            <Link to={"/tags/item/" + app.tagModeTag} className="cursor-pointer">
              <span className="mp-secondary">#</span><span className="mp-counter mp-accent-hover">{app.tagModeTag}</span>
            </Link>
          </h5>
        </div> : <div>
          <h5 className="title">{TEXT.tags}</h5>
          <Link to="/tags">
            <button className="button modeButton tagModeButton tagWrap">
              <span className="bigHashtag mp-secondary">#</span><span className="tagContent">{TEXT.toTags}</span>
            </button>
          </Link>
          <p className="subtitle">{TEXT.mapTagModeSub}</p>
        </div>}
      </div>

      {app.mode &&
        <div className="modeType mp-border-secondary">
          <button className="button modeButton capitalize mp-counter mp-border-counter" onClick={reset}>{TEXT.reset}</button>
        </div>
      }

    </div>
  )
}