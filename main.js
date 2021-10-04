/* eslint-disable eol-last */
/* eslint-disable spaced-comment */
/* eslint-disable indent */
import {
  changeMenu,
} from './router.js';

const initRouter = () => {
  window.addEventListener('hashchange', () => { //se ejecuta cuando cambia la url despues de "#"
    changeMenu(window.location.hash);
  });
};
//window.addEventListener('load', initRouter);
window.addEventListener('load', () => {
  changeMenu(window.location.hash); // #...
  initRouter();
});