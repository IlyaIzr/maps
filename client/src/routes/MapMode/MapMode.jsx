import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TEXT } from '~rest/lang'
import { friendModeId, setMapMode } from '~store/app'
import { getMapModeLabel } from '../../navigation/NavMain'
import { ReactComponent as DrawIcon } from '~rest/svg/draw.svg'
import { AppLink } from '~components/Link/AppLink'

export const MapMode = () => {
  const dispatch = useDispatch()
  const { friends, id } = useSelector(s => s.user)
  const app = useSelector(s => s.app)
  const user = useSelector(s => s.user)


  const [modeLabel, setModeLabel] = useState(TEXT.defaultMode)

  useEffect(() => {
    (function () {
      const label = getMapModeLabel(app, friends, id)
      return setModeLabel(label)
    })()
    // eslint-disable-next-line
  }, [app.mode, app.friendModeId, app.tagModeTag])


  function runFriendMode(id) {
    friendModeId(dispatch, id)
    setMapMode(dispatch, 'watch')
  }

  function reset() {
    setMapMode(dispatch, 'default')
  }

  function runDrawMode() {
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
          {Boolean(friends?.length) ? friends.map(friend => {
            return (
              <div className="friendContainer" key={friend.id1 + friend.id2}>
                <AppLink to="/" onClick={() => runFriendMode(friend.id)}>
                  <div className="resultUser cursor-pointer mp-accent-hover transition-small">

                    <div className="authorLogo mp-bg-primary">
                      <span className="mp-dark" title={friend.login}>{String(friend.name)?.[0]?.toUpperCase()}</span>
                    </div>

                    <div className="resultUser-creds">
                      <p className="mp-primary">{friend.name}</p>
                      <label className="cursor-pointer">({friend.login})</label>
                    </div>
                  </div>
                </AppLink>
              </div>
            )
          }) :
            <div className="noFriendsCase">
              <h5>{TEXT.watchModeSub2}</h5>
              <AppLink to="/friends">
                <button>{TEXT.addFriends.capitalize()}</button>
              </AppLink>
            </div>}

        </div>
      </div>

      {/* my marks */}

      {(user.id !== 'anonimus') && <div className="myMarks">
        <button className="button" onClick={() => runFriendMode(user.id)}>
          <h5 className="title cursor-pointer capitalize" >{TEXT.myMarks}</h5>
        </button>
      </div>}

      {/* drawMode */}
      {app.mode !== 'draw' &&
        <div className="modeType mp-border-secondary">
          <h5 className="title">{TEXT.drawMode}</h5>
          {Boolean(user?.level < 2) ?
            <p className="subtitle">{TEXT.drawModeLevelOnly}</p>
            : <>
              <AppLink to="/" onClick={runDrawMode}>
                <button className="button modeButton drawModeButton">
                  <DrawIcon fill="var(--secondary)" className="nav-icon" />
                  {TEXT.toDrawMode}
                </button>
              </AppLink>
              <p className="subtitle">{TEXT.watchModeSub3}</p>
            </>}
        </div>
      }

      {/* tagMode */}
      <div className="modeType mp-border-secondary">{app.tagModeTag ?
        <div>
          <h5 className="title">
            <span className="capitalize">{TEXT.tag + ': '}</span>
            <AppLink to={"/tags/item/" + app.tagModeTag} className="cursor-pointer">
              <span className="mp-secondary">#</span><span className="mp-counter mp-accent-hover">{app.tagModeTag}</span>
            </AppLink>
          </h5>
        </div> : <div>
          <h5 className="title">{TEXT.tags}</h5>
          <AppLink to="/tags">
            <button className="button modeButton tagModeButton tagWrap">
              <span className="bigHashtag mp-secondary">#</span><span className="tagContent">{TEXT.toTags}</span>
            </button>
          </AppLink>
          <p className="subtitle">{TEXT.mapTagModeSub}</p>
        </div>}
      </div>

      {app.mode &&
        <div className="modeType mp-border-secondary">
          <AppLink to="/" onClick={reset}>
            <button className="button modeButton capitalize mp-counter mp-border-counter">{TEXT.reset}</button>
          </AppLink>
        </div>
      }

    </div>
  )
}
