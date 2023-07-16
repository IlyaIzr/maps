import type { Dispatch } from "redux";
import { uuidv4 } from "~rest/helperFuncs";

const TOAST_DEFAULT_LIFETIME = 3500;

export type Toast = {
  message: string;
  clickAction: () => void;
  status: "error" | "warning" | "info" | "complete";
  title?: string;
  lifeTime?: number;
  _id?: string;
};

type ToastArguments = Partial<Toast> & { message: string };

type StateType = { toasts: Toast[] };
const INITIAL_STATE: StateType = {
  toasts: [],
};

const SET_TOAST = "toasts/SET_TOAST";
const REMOVE_TOAST = "toasts/REMOVE_TOAST";
type ToastAction =
  | { type: SET_TOAST; toast: ToastArguments }
  | { type: REMOVE_TOAST; id: string };

export const toastsReducer = (state = INITIAL_STATE, action: ToastAction) => {
  switch (action.type) {
    case SET_TOAST: {
      const toast: ToastArguments = action.toast;
      toast._id = uuidv4();
      !toast.status && (toast.status = "error");
      !toast.lifeTime && (toast.lifeTime = TOAST_DEFAULT_LIFETIME);

      return {
        ...state,
        toasts: [...state.toasts, toast],
      };
    }
    case REMOVE_TOAST: {
      const id = action.id;
      const newToasts = state.toasts.filter((toast) => toast._id !== id);
      return {
        ...state,
        toasts: newToasts,
      };
    }
    default:
      return state;
  }
};

export const setToastNew = (dispatch: Dispatch, toast: ToastArguments) => {
  dispatch({ type: SET_TOAST, toast });
};

export function removeToast(dispatch: Dispatch, toast: Toast) {
  dispatch({ type: REMOVE_TOAST, id: toast._id });
}
