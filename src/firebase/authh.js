/* eslint-disable eol-last */
// Obtener data del usuario que ingresa a la red social
// export const userInfo = () => firebase.auth().currentUser;
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

// Se llama cuando un usuario se loguea o desloguea
// Extrae información de usuario luego de ingresar a home
export const authStateChanged = (cb) => firebase.auth().onAuthStateChanged(cb);