import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'mapbox-gl/dist/mapbox-gl.css';
import { store } from './store/root';
import { Provider } from 'react-redux'
import reportWebVitals from './reportWebVitals';
import { initActions } from './rest/beforeApp';
import { GoogleOAuthProvider } from '@react-oauth/google';

(async function () {
  // const refresh = 
  await initActions()
  // if (refresh === 'connection_error')

  ReactDOM.render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_G_AUTH_KEY}>
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    </GoogleOAuthProvider>,
    document.getElementById('root')
  );
}())

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
