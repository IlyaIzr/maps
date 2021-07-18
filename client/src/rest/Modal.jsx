import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '../store/app'
import { TEXT } from './lang'

export const Modal = () => {
  const data = useSelector(state => state.app.modal)
  const dispatch = useDispatch()
  const acceptLabel = data.acceptLabel || TEXT.acceptDefault
  const cancelLabel = data.cancelLabel || TEXT.cancelDefault

  function cancel() {
    data.cancelAction?.()
    closeModal(dispatch)
  }
  function accept() {
    data.acceptAction?.()
    closeModal(dispatch)
  }
  
  if (!data) return null;
  return (
    <div className="modal-dialog-wrap">
      <div className="modal-dialog mp-border-dark mp-bg-light">
        <div className="modal-dialog-content mp-dark">
          <div className="modal-content">{data.message}</div>
          {data.childComponent}
          <div className="modal-buttons">
            <button className="modal-cancel" onClick={cancel}>{cancelLabel}</button>
            <button className="modal-accept" onClick={accept}>{acceptLabel}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
