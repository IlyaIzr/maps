import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { registerUser } from '../requests/users'
import { TEXT } from '../rest/lang'
import { Responser } from '../rest/Responser'
import { setLogInCreds } from '../store/user'
const initCreds = { login: '', pword: '', name: '', question: TEXT.secretExample, answer: '' }

export const Register = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [creds, setCreds] = useState(initCreds)
  const [msg, setMsg] = useState('')
  const ref = useRef(null)
  const [replica, setReplica] = useState(false);

  function onInput(e) {
    setCreds({ ...creds, [e.target.name]: e.target.value })
  }
  function onReplica() {
    setReplica(false)
    setMsg(TEXT.secretReplica2)
    ref.current.focus()
  }

  async function onSubmit() {
    if (!creds.login || !creds.pword) return setMsg(TEXT.fillRequiredFields)
    if (creds.question && !creds.answer) {
      if (creds.question === TEXT.secretExample) setReplica(true)
      ref.current.focus()
      return setMsg(TEXT.secretValidation)
    }

    // Validation
    if (creds.question?.length > 300) return setMsg((TEXT.field + ' ' + TEXT.secretQuestion + ' ' + TEXT.tooLong).toLocaleLowerCase().capitalize())
    if (creds.answer?.length > 255) return setMsg((TEXT.field + ' ' + TEXT.secterAnswer + ' ' + TEXT.tooLong).toLocaleLowerCase().capitalize())
    if (creds.login.length > 50) return setMsg((TEXT.field + ' ' + TEXT.login + ' ' + TEXT.tooLong).toLocaleLowerCase().capitalize())
    if (creds.pword.length > 50) return setMsg((TEXT.field + ' ' + TEXT.password + ' ' + TEXT.tooLong).toLocaleLowerCase().capitalize())
    if (creds.name.length > 140) return setMsg((TEXT.field + ' ' + TEXT.userName + ' ' + TEXT.tooLong).toLocaleLowerCase().capitalize())


    const res = await registerUser(creds)
    console.log('%c⧭', 'color: #86bf60', creds, res);
    if (res.status === 'OK') {
      setMsg(TEXT.successfullReg)
      setLogInCreds(dispatch, res.data)
      setCreds(initCreds)
      history.push('/')
    }
    else if (res.status === 'EXISTING') {
      return setMsg(TEXT.loginOccupied + ' - ' + creds.login)
    }
    else if (res.status === 'BANEDPWORD') {
      return setMsg(TEXT.bannedPwod + ' - ' + creds.pword)
    }
    else {
      setMsg(TEXT.errorReg + ', ' + TEXT.errCode + ': ' + (res.msg || res))
    }
  }

  return (
    <div>
      <div className="register-form">
        <h4>{TEXT.register}</h4>
        <label htmlFor="login">{TEXT.login}:</label>
        <input type="text" name="login" value={creds.login} onInput={onInput} autoFocus required />
        <br />
        <label htmlFor="name">{TEXT.userName}:</label>
        <input type="text" name="name" value={creds.name} onInput={onInput} required />
        <br />
        <label htmlFor="pword">{TEXT.password}:</label>
        <input type="password" name="pword" value={creds.pword} onInput={onInput} required />
        <br />
        <br />
        <label htmlFor="question">{TEXT.secretQuestion}:</label>
        <br />
        <textarea type="text" name="question" value={creds.question} onInput={onInput} autoComplete="false"/>
        <p className="little-hint">{TEXT.secretHint}</p>

        <label htmlFor="answer">{TEXT.secterAnswer}:</label>
        <input type="text" name="answer" value={creds.answer} onInput={onInput} required={Boolean(creds.question)} ref={ref} autoComplete="false" />
        <div className="register-responser">
          <Responser message={msg} setMessage={setMsg} />
        </div>
        {replica &&
          <button className="btn-replica mp-border-counter mp-primary-hover" onClick={onReplica}>{TEXT.secretReplica}</button>}
        <button className="mp-border-accent" type="button" onClick={onSubmit}>{TEXT.submit}</button>
      </div>

    </div>
  )
}
