import { useHistory, useLocation, useParams } from 'react-router-dom';

export const Profile = () => {
  const from = new URLSearchParams(useLocation().search).get('from')
  const { userId } = useParams();
  const history = useHistory()

  function onBack() {
    history.push(`/friends/search?query=${from}`)    
  }
  
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
