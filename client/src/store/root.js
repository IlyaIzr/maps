import { combineReducers, createStore } from 'redux';
import { appReducer } from './app';
import { userReducer } from './user';


export const rootReducer = combineReducers({
  user: userReducer,
  app: appReducer
});

export const store = createStore(rootReducer);
