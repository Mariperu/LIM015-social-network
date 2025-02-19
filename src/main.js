/* eslint-disable eol-last */
/* eslint-disable spaced-comment */
/* eslint-disable indent */
import {
  changeMenu,
} from './router.js';

// Cambio de rutas
const initRouter = () => {
  window.addEventListener('hashchange', () => { //se ejecuta cuando cambia la url despues de "#"
    changeMenu(window.location.hash);
  });
};

window.addEventListener('load', () => {
  changeMenu(window.location.hash); // #...
  initRouter();
});