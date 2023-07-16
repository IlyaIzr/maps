import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../store/app";
import { Toast } from "./Toast";
import s from "./Toast.module.css";

export const ToastStack = () => {
  const activeToasts = useSelector((state) => state.toasts.toasts);

  return (
    <div className={s.toastStack}>
      {activeToasts.map((toast) => (
        <Toast toast={toast} key={toast._id} />
      ))}
    </div>
  );
};
