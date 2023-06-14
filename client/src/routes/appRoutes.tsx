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
  path: string,
  component: JSX.Element,
  isNested?: boolean
}


export const appRoutes: Record<string, RouteConfig> = {
  auth: {
    path: 'auth',
    component: <AuthMain />
  },
  alphaReg: {
    // TODO alpha only
    path: 'alphaReg',
    component: <AlphaReg />
  },
  editProfile: {
    path: 'editProfile',
    component: <EditProfile />,
  },
  googleConfirm: {
    path: 'googleConfirm',
    component: <GoogleConfirm />,
  },
  friends: {
    path: 'friends',
    component: <FriendsMain />
  },
  'friends/item/': {
    path: 'friends/item/',
    component: <FriendsMain />,
    isNested: true
  },
  'friends/search': {
    path: 'friends/search',
    component: <FriendsMain />,
    isNested: true
  },
  'friends/addByLink': {
    path: 'friends/addByLink',
    component: <FriendsMain />,
    isNested: true
  },
  mapMode: {
    path: 'mapMode',
    component: <MapMode />
  },
  tags: {
    path: 'tags',
    component: <TagsMain />
  },
  'tags/item/': {
    path: 'tags/item/',
    component: <TagsMain />,
    isNested: true
  },
  'tags/search': {
    path: 'tags/search',
    component: <TagsMain />,
    isNested: true
  },
  about: {
    path: 'about',
    component: <About />
  },
  cities: {
    path: 'cities',
    component: <Cities />
  }
};
