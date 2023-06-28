import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '../store/app'
import { TEXT } from './lang'

export const Modal = () => {
  const data = useSelector(state => state.app.modal)
  const dispatch = useDispatch()
  const acceptLabel = data.acceptLabel !== undefined ? data.acceptLabel : TEXT.acceptDefault
  const cancelLabel = data.cancelLabel !== undefined ? data.cancelLabel : TEXT.cancelDefault

  async function cancel() {
    await data.cancelAction?.()
    closeModal(dispatch)
  }
  async function accept() {
    await data.acceptAction?.()
    closeModal(dispatch)
  }
  async function outsideClick(e) {
    e.stopPropagation()
    await cancel()
  }
  function stopPropagation(e) {
    e.stopPropagation()    
  }

  if (!data) return null;
  return (
    <div className="modal-dialog-wrap" onClick={outsideClick}>
      <div className="modal-dialog mp-border-dark mp-bg-light" onClick={stopPropagation}>
        <div className="modal-dialog-content mp-dark">
          <div className="modal-content">{data.message}</div>
          {Boolean(data.children) && data.children}
          <div className="modal-buttons">
            {Boolean(cancelLabel) &&
              <button className="modal-cancel" onClick={cancel}>{cancelLabel}</button>}
            {Boolean(acceptLabel) &&
              <button className="modal-accept" onClick={accept}>{acceptLabel}</button>}
          </div>
        </div>
      </div>
    </div>
  )
}
