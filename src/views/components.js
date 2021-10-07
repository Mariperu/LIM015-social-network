/* eslint-disable eol-last */
/* eslint-disable indent */
import {
  loginView,
} from './login.js';

import {
  registerView,
} from './register.js';

import {
  homeView,
} from './home.js';

import {
  profileView,
} from './profile.js';

import errorView from './error404.js';

// Componentes
export default {
  login: loginView,
  register: registerView,
  home: homeView,
  profile: profileView,
  error404: errorView,
};