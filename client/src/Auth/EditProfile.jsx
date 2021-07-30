import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { logout } from "../requests/auth"
import { updateUser, updateUserPword } from "../requests/users"
import { TEXT } from "../rest/lang"
import { Responser } from "../rest/Responser"
import { logIntoApp, logOutOfApp } from "../store/user"
const initCreds = { login: '', pword: '', name: '', question: '', answer: '' }

export const EditProfile = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const history = useHistory()

  const [creds, setCreds] = useState(initCreds)
  const [secretChallenge, setSecretChallenge] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (user.id) setCreds(c => {
      return { ...c, name: user.name, login: user.login, avatar: user.avatar }
    })
    return () => {
      setCreds(initCreds)
    };
  }, [user]);

  function onInput(e) {
    setCreds({ ...creds, [e.target.name]: e.target.value })
  }

  async function onSubmit(e) {
    e.preventDefault()

    if (!creds.login || !creds.name) return setMsg(TEXT.fillRequiredFields)

    // Validation
    if (creds.login.length > 50) return setMsg((TEXT.field + ' ' + TEXT.login + ' ' + TEXT.tooLong).toLocaleLowerCase().capitalize())
    if (creds.pword.length > 50) return setMsg((TEXT.field + ' ' + TEXT.password + ' ' + TEXT.tooLong).toLocaleLowerCase().capitalize())
    if (creds.name.length > 140) return setMsg((TEXT.field + ' ' + TEXT.userName + ' ' + TEXT.tooLong).toLocaleLowerCase().capitalize())

    // Case pword change call
    if (secretChallenge) {
      const res = await updateUserPword(creds)
      if (res.status === 'OK') {
        setMsg(TEXT.successfulUpdate)
        setSecretChallenge(false)
        return logIntoApp(dispatch, res.data)
      }
      else if (res.status === 'BANEDPWORD') {
        return setMsg(TEXT.bannedPwod + ' - ' + creds.pword)
      }
      return setMsg(TEXT.errCode + ': ' + (res.msg || res))
    }

    const res = await updateUser(creds)
    console.log('%c⧭', 'color: #514080', res);

    if (res.status === 'OK') {
      setMsg(TEXT.successfulUpdate)
      return logIntoApp(dispatch, res.data)
    }
    else if (res.status === 'EXISTING') {
      return setMsg(TEXT.loginOccupied + ' - ' + creds.login)
    }
    else if (res.status === 'PWORDCHANGE') {
      setSecretChallenge(true)
      setCreds({ ...creds, question: res.data.question })
      return setMsg(TEXT.secretChallenge)
    }
    else setMsg(TEXT.errCode + ': ' + (res.msg || res))
  }

  async function logOut() {
    const res = await logout()
    if (res.status === 'OK') {
      setCreds(initCreds)
      setMsg('')
      logOutOfApp(dispatch)
      return history.push('/')
    }
    setMsg(TEXT.errCode + ': ' + (res.msg || res))
  }

  return (
    <div className="edit-profile-area relative ">

      <div className="edit-profile-wrapper absolute center mp-border-secondary">
        <form className="edit-profile ">
          <h4>{TEXT.editProfile}</h4>

          <label htmlFor="login">{TEXT.login}:</label>
          <input type="text" name="login" value={creds.login} onInput={onInput} autoFocus required />
          <br />
          <label htmlFor="name">{TEXT.userName}:</label>
          <input type="text" name="name" value={creds.name} onInput={onInput} autoFocus required />
          <br />
          <label htmlFor="pword">{TEXT.password}:</label>
          <input type="password" name="pword" value={creds.pword} onInput={onInput} />
          <br />
          <br />
          {secretChallenge && <>
            <label htmlFor="question">{TEXT.secretQuestion}:</label>
            <br />
            <textarea type="text" name="question" value={creds.question} onInput={onInput} autoComplete="false" readOnly />
            <br />
            <label htmlFor="answer">{TEXT.secterAnswer}:</label>
            <input type="text" name="answer" value={creds.answer} onInput={onInput} required={Boolean(creds.question)} autoComplete="false" />
            <br />
          </>}
          <Responser message={msg} setMessage={setMsg} />

        </form>

        <hr className="mp-border-secondary" />
        <div className="logout-container">
          <button className="mp-border-secondary profile-logout" onClick={logOut}>{TEXT.logout}</button>
          <button className="mp-border-accent" onClick={onSubmit}>{TEXT.submit}</button>
        </div>
      </div>
    </div>
  )
}
