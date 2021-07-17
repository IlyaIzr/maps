import { useRef, useState } from 'react'
import { TEXT } from '../rest/lang'
import { Responser } from '../rest/Responser'
const initCreds = { login: '', pword: '', secret: TEXT.secretExample, answer: '' }

export const Register = () => {
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
    if (creds.secret && !creds.answer) {
      if (creds.secret === TEXT.secretExample) setReplica(true)
      ref.current.focus()
      return setMsg(TEXT.secretValidation)
    }
    console.log(creds)
    // request
    // finally
    setCreds(initCreds)
  }

  return (
    <div>
      <div className="register-form">
        <h4>{TEXT.register}</h4>
        <label htmlFor="login">{TEXT.yourLogin}:</label>
        <input type="text" name="login" value={creds.login} onInput={onInput} autoFocus required />
        <br />
        <label htmlFor="pword">{TEXT.yourPword}:</label>
        <input type="password" name="pword" value={creds.pword} onInput={onInput} required />
        <br />
        <br />
        <label htmlFor="secret">{TEXT.secretQuestion}:</label>
        <br />
        <textarea type="text" name="secret" value={creds.secret} onInput={onInput} />
        <p className="hint">{TEXT.secretHint}</p>

        <label htmlFor="answer">{TEXT.secterAnswer}:</label>
        <input type="text" name="answer" value={creds.answer} onInput={onInput} required={Boolean(creds.secret)} ref={ref} />
        <div className="register-responser">
          <Responser message={msg} setMessage={setMsg} />
        </div>
        {replica &&
          <button className="small" onClick={onReplica}>{TEXT.secretReplica}</button>}
        <button className="small mp-bg-primary mp-border-secondary" type="button" onClick={onSubmit}>{TEXT.submit}</button>
      </div>

    </div>
  )
}
