/* eslint-disable eol-last */

// Obtiene data del usuario logueado
export const userInfo = () => {
  const user = firebase.auth().currentUser;
  let data = '';
  if (user !== null) {
    data = {
      name: user.displayName,
      id: user.uid,
      photo: user.photoURL !== null ? user.photoURL : './img/avatar.png',
    };
  }
  return data;
};

// Ejecuta cambio de estado, cuando user se loguea o desloguea
export const authStateChanged = (cb) => firebase.auth().onAuthStateChanged(cb);