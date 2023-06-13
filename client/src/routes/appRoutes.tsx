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
  isNested?: boolean
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
    component: <FriendsMain />,
    isNested: true
  },
  {
    id: 'friends/search',
    component: <FriendsMain />,
    isNested: true
  },
  {
    id: 'friends/addByLink',
    component: <FriendsMain />,
    isNested: true
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
    isNested: true
  },
  {
    id: 'tags/search',
    component: <TagsMain />,
    isNested: true
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