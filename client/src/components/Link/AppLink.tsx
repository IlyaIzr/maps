import { HTMLAttributes } from "react";
import { useHistory } from "react-router-dom";
import { withUrlSearch } from "~store/url";

type LinkProps = {
  to: string
  divProps?: HTMLAttributes<HTMLDivElement>
}

export function AppLink({ to, children, divProps }: React.PropsWithChildren<LinkProps>) {  
  const history = useHistory()
  
  function onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    history.push(withUrlSearch(to))
    divProps?.onClick?.(e)
  }

  return (
    <div {...divProps} onClick={onClick}>
      {children}
    </div>
  )
}