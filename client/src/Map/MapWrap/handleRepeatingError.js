import { TEXT } from "../../rest/lang"
import { setToast } from "../../store/app"

export function handleRepeatingError(d, res) {
  if (res?.status !== 'ERR' && res?.code !== 'REPEATING_COMMENT') return false

  setToast(d, {
    message: `${TEXT.repeatingComment.capitalize()}`,
    status: 'info'
  })
  return true;
}