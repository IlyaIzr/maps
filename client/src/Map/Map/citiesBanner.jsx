import { getPreference, setPreference } from '~store/localstorage';
import { TEXT } from '~rest/lang';
import { setBanner } from '~store/app';
import { SKIP_BANNER_LOCAL_STORAGE_KEY } from '../const';


export function registerCitiesBanner(dispatch, history, mapCallbacks) {
  if (getPreference(SKIP_BANNER_LOCAL_STORAGE_KEY)) return;

  const closeBanner = setBanner(dispatch, {
    content: <div>{TEXT.noReviews.capitalize()}<br />{TEXT.popularCitiesSuggestion}</div>,
    bottomControls: [
      {
        element: <div className='mp-dark'>{TEXT.close.capitalize()}</div>,
        onClick: (e, close) => {
          close();
          setPreference(SKIP_BANNER_LOCAL_STORAGE_KEY, true)
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