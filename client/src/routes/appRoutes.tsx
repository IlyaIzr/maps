import { lazily } from 'react-lazily';

const { About } = lazily(() => import('./About/About'));
const { Cities } = lazily(() => import('./Cities/Cities'));
const { AuthMain } = lazily(() => import('../Auth/AuthMain'));
const { EditProfile } = lazily(() => import('../Auth/EditProfile'));
const { GoogleConfirm } = lazily(() => import('../Auth/GoogleConfirm'));
const { FriendsMain } = lazily(() => import('./Friends/FriendsMain'));
const { MapMode } = lazily(() => import('./MapMode/MapMode'));
const { AlphaReg } = lazily(() => import('../Auth/AlphaReg'));
const { TagsMain } = lazily(() => import('./Tags/TagsMain'));

type RouteConfig = {
  id: string,
  component: JSX.Element,
  withParams?: boolean
}

export const appRoutes: RouteConfig[] = [
  {
    id: 'auth',
    component: <AuthMain />
  },
  {
    // TODO alpha only
    id: 'alphaReg',
    component: <AlphaReg />
  },
  {
    id: 'editProfile',
    component: <EditProfile />,
  },
  {
    id: 'googleConfirm',
    component: <GoogleConfirm />,
  },
  {
    id: 'friends',
    component: <FriendsMain />
  },
  {
    id: 'friends/item/',
    component: <FriendsMain />
  },
  {
    id: 'friends/search',
    component: <FriendsMain />
  },
  {
    id: 'friends/addByLink',
    component: <FriendsMain />
  },
  {
    id: 'mapMode',
    component: <MapMode />
  },
  {
    id: 'tags',
    component: <TagsMain />
  },
  {
    id: 'tags/item/',
    component: <TagsMain />,
    withParams: true
  },
  {
    id: 'tags/search',
    component: <TagsMain />,
    withParams: true
  },
  {
    id: 'about',
    component: <About />
  },
  {
    id: 'cities',
    component: <Cities />
  }
]