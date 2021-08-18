import { useState } from 'react';
import { useEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Loading } from '../rest/Loading';

export const Profile = () => {
  const from = new URLSearchParams(useLocation().search).get('from')
  const { userId } = useParams();
  const history = useHistory()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  function onBack() {
    history.push(`/friends/search?query=${from}`)
  }

  useEffect(() => {
    (function () {
      // const
    })()
  }, [])

  if (loading) return (
    <div>
      <div onClick={onBack}
        className="
          menu-avatar cursor-pointer 
          mp-bg-accent-hover mp-light-hover
          mp-bg-primary mp-light
          transition"
      >
        <div className="letter" >{"<"}</div>
      </div>
      <Loading loading={loading} />
    </div>
  )


  return (
    <div>
      <div onClick={onBack}
        className="
          menu-avatar cursor-pointer 
          mp-bg-accent-hover mp-light-hover
          mp-bg-primary mp-light
          transition"
      >
        <div className="letter" >{"<"}</div>
      </div>
      User profile, id is {userId}
    </div>
  )
}
