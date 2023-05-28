import s from './MainRouteWrap.module.css'

type MainWrapProps = React.PropsWithChildren & {
  isHidden: boolean
}

export function MainRouteWrap({ children, isHidden }: MainWrapProps) {

  return (<div className={isHidden ? s.hidden : s.mainWrapper}>
    {children}
  </div>)
}