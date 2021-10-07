/* eslint-disable eol-last */
/* eslint-disable indent */
import components from './views/components.js';
import {
  authStateChanged,
} from './firebase/authh.js';

// Rutas
export const changeMenu = (route) => {
  const root = document.querySelector('#root');
  switch (route) {
    case '':
    case '/':
    case '#':
    case '#/':
      root.appendChild(components.login());
      break;

    case '#/register':
      root.appendChild(components.register());
      break;

    case '#/home':
      authStateChanged((user) => { // observa cambio de estado log in/out
        if (user !== null) {
          const userObject = {
            name: user.displayName,
            id: user.uid,
            photo: user.photoURL !== null ? user.photoURL : './img/avatar.png',
          };
          root.appendChild(components.home(userObject));
        }
      });
      break;

    case '#/profile':
      authStateChanged((user) => { // observa cambio de estado log in/out
        if (user !== null) {
          const userObject = {
            name: user.displayName,
            id: user.uid,
            photo: user.photoURL !== null ? user.photoURL : './img/avatar.png',
          };
          root.appendChild(components.profile(userObject));
        }
      });
      break;

    default:
      return components.error404();
  }
};