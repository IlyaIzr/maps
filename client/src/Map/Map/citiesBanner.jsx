import { getPreference, setPreference } from '~store/localstorage';
import { TEXT } from '~rest/lang';
import { setBanner } from '~store/app';

const SKIP_BANNER = 'skip_banner'

export function registerCitiesBanner(dispatch, history, featuresLength, mapCallbacks) {
  if (featuresLength || getPreference(SKIP_BANNER)) return;

  const closeBanner = setBanner(dispatch, {
    content: <div>{TEXT.noReviews.capitalize()}<br />{TEXT.popularCitiesSuggestion}</div>,
    bottomControls: [
      {
        element: <div className='mp-dark'>{TEXT.close.capitalize()}</div>,
        onClick: (e, close) => {
          close();
          setPreference(SKIP_BANNER, true)
        }
      },
      {
        element: <div className='mp-accent'>{TEXT.watchCities.capitalize()}</div>,
        onClick: (e, close) => {
          history.push('/cities')
          close()
        }
      }
    ]
  })
  mapCallbacks.addRepetitiveCb(closeBanner, 'closeCitiesBanner')
}