import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { registerGUser } from '../requests/users';
import { googleCreds } from '../rest/config';
import { TEXT } from '../rest/lang';
import { Responser } from '../rest/Responser';
import { setLogInCreds } from '../store/user';


export const GoogleConfirm = () => {
  const dispatch = useDispatch()
  const history = useHistory()


  const [creds, setCreds] = useState({
    ...googleCreds
  })
  const [msg, setMsg] = useState('')


  function onInput(e) {
    setCreds({ ...creds, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    setCreds(googleCreds)
  }, [])

  async function onSubmit() {
    // validation
    if (creds.login.length > 50) return setMsg((TEXT.field + ' ' + TEXT.login + ' ' + TEXT.tooLong).toLocaleLowerCase().capitalize())
    if (creds.name.length > 140) return setMsg((TEXT.field + ' ' + TEXT.userName + ' ' + TEXT.tooLong).toLocaleLowerCase().capitalize())

    const data = { ...creds }
    delete data.occupiedLogin

    const res = await registerGUser(data)
    console.log('%c⧭', 'color: #0088cc', res);
    if (res.status === 'OK') {
      setMsg(TEXT.successfullReg)
      setLogInCreds(dispatch, res.data)
      console.log('%c⧭', 'color: #00b300', googleCreds);
      Object.keys(googleCreds).forEach(key => {
        googleCreds.key = null        
      })
      setCreds(googleCreds)
      history.push('/')
    }
    else if (res.status === 'EXISTING') {
      return setMsg(TEXT.loginOccupied + ' - ' + creds.login)
    }
    else if (res.status === 'BANEDPWORD') {
      return setMsg(TEXT.bannedPassword + ' - ' + creds.pword)
    }
    else {
      setMsg(TEXT.errorReg + ', ' + TEXT.errCode + ': ' + (res.msg || res))
    }

  }

  return (
    <div className="auth-container relative">
      <div className="absolute center auth-subcontainer">
        <div className="google-regform mp-border-secondary">
          <h4>{TEXT.oauthTitle}</h4>
          <label htmlFor="login">{TEXT.login}:</label>
          <input type="text" name="login" value={creds.login} onInput={onInput} required />
          {googleCreds.occupiedLogin &&
            <p className="little-hint">{TEXT.login + ' ' + googleCreds.occupiedLogin + ' ' + TEXT.occupied}</p>
          }
          <br />
          <label htmlFor="name">{TEXT.userName}:</label>
          <input type="text" name="name" value={creds.name} onInput={onInput} required />
          <br />

          <Responser message={msg} setMessage={setMsg} />

          <button className="mp-border-accent" type="button" onClick={onSubmit}>{TEXT.confirm}</button>
        </div>
      </div>
    </div>
  )
}
