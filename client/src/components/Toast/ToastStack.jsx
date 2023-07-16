import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../store/app";
import { Toast } from "./Toast";
import s from "./Toast.module.css";

export const ToastStack = () => {
  const activeToasts = useSelector((state) => state.toasts.toasts);
  console.log("activeToasts", activeToasts);

  return (
    <div className={s.toastStack}>
      {activeToasts.map((toast) => (
        <Toast toast={toast} key={toast._id} />
      ))}
    </div>
  );
};

export function TestCallToast() {
  const dispatch = useDispatch();
  function onClick() {
    setToast(dispatch, {
      message: "afjb" + Math.random().toPrecision(3),
      status: "info",
      clickAction: () => null,
      title: "Peppo",
    });
  }
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        top: "180px",
        right: "100px",
        zIndex: "1000",
        color: "red",
      }}
    >
      Call toast
    </button>
  );
}
