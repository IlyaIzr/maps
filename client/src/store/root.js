import { combineReducers, createStore } from 'redux';
import { appReducer } from './app';
import { userReducer } from './user';
import { mapReducer } from './map';


export const rootReducer = combineReducers({
  user: userReducer,
  app: appReducer,
  map: mapReducer
});

export const store = createStore(rootReducer);
