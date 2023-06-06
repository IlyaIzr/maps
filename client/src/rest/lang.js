import { enLocale } from "./localization/enLocale"
import { ruLocale } from "./localization/ruLocale"

export const DOCUMENT_LANG = document.documentElement.lang
// export const DOCUMENT_LANG = 'ru'

// i'm not expecting any more languages soon so it's that simple check
export const TEXT = (DOCUMENT_LANG === 'ru') ? ruLocale : enLocale 
