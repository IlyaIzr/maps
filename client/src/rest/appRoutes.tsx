import { lazily } from 'react-lazily';

const { About } = lazily(() => import('../navigation/About'));
const { AuthMain } = lazily(() => import('../Auth/AuthMain'));
const { EditProfile } = lazily(() => import('../Auth/EditProfile'));
const { GoogleConfirm } = lazily(() => import('../Auth/GoogleConfirm'));
const { FriendsMain } = lazily(() => import('../Friends/FriendsMain'));
const { MapMode } = lazily(() => import('../navigation/MapMode'));
const { AlphaReg } = lazily(() => import('../Auth/AlphaReg'));
const { TagsMain } = lazily(() => import('../Tags/TagsMain'));

// type RouteConfig = {
//   id: string,
//   component: JSX.Element
// }

export const appRoutes = [
  {
    id: 'auth',
    component: <AuthMain />
  },
  {
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
    id: 'mapMode',
    component: <MapMode />
  },
  {
    id: 'tags',
    component: <TagsMain />
  },
  {
    id: 'about',
    component: <About />
  }
]