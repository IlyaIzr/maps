import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeToast } from "~store/toast";
import { TEXT } from "~rest/lang";
import s from "./Toast.module.css";

const COLLAPSING_TIME = 3000;
export const Toast = ({ toast }) => {
  const d = useDispatch();
  const [timeouts, setTimeouts] = useState([]);
  const [animation, setAnimation] = useState("show"); // or 'slideUp' or 'dead'

  useEffect(() => {
    const t1 = setTimeout(() => {
      startEndingAnimation();
    }, toast.lifeTime);

    setTimeouts([...timeouts, t1]);

    // before unmount
    return () => {
      clearTimeouts();
    };
  }, []);

  function startEndingAnimation() {
    setAnimation("slideUp");

    const t2 = setTimeout(() => {
      removeToast(d, toast);
      // stop taking any place
      setAnimation("dead");
    }, COLLAPSING_TIME);

    setTimeouts([...timeouts, t2]);
  }

  function clearTimeouts() {
    timeouts.forEach((t) => clearTimeout(t));
    setTimeouts([]);
  }

  function onMouseEnter() {
    clearTimeouts();
    setAnimation("show");
  }

  function onClick() {
    toast.clickAction?.();
    startEndingAnimation();
  }

  const {
    bg,
    border,
    info,
    main,
    toastTitle: title,
  } = getDynamicValues(toast.status, toast.title);
  return (
    <div
      className={`
      ${s.toast} 
      ${s[animation]} 
      mp-${main} mp-bg-${bg} mp-border-${border} cursor-pointer
      `}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div className={s.header}>
        {title ? (
          <>
            <h6>{title}</h6>
            {/* <div className={`close-cross mp-${info}`}>&#10006;</div> */}
          </>
        ) : (
          <>
            <p className={`mp-${info}`}>{toast.message}</p>
            {/* <div className={`${s.closeCross} mp-${main}`}>&#10006;</div> */}
          </>
        )}
      </div>
      {Boolean(title) && (
        <div className={`${s.content} mp-${info}`}>{toast.message}</div>
      )}
    </div>
  );
};

function getDynamicValues(status, title) {
  let main = "accent";
  let info = "dark";
  let bg = "light";
  let border = "accent";
  let toastTitle = title !== undefined ? title : TEXT.error;
  if (status === "info") {
    main = "counter";
    info = "dark";
    bg = "light";
    border = "counter";
    toastTitle = "";
  } else if (status === "warning") {
    main = "counter";
    info = "accent";
    bg = "light";
    border = "accent";
    toastTitle = title !== undefined ? title : TEXT.warning + "!";
  } else if (status === "complete") {
    main = "counter";
    info = "dark";
    bg = "light";
    border = "counter";
    toastTitle = title !== undefined ? title : TEXT.complete + "!";
  }

  return {
    main,
    info,
    bg,
    border,
    toastTitle,
  };
}
