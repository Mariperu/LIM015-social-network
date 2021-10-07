/* eslint-disable eol-last */
/* eslint-disable indent */

// Registrar
export const createUserWEP = (email, password) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  firebase.auth().createUserWithEmailAndPassword(email, password);

// Loguear con google
export const signInWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider(); // Proveedor de google
  return firebase.auth().signInWithPopup(provider); // Popup, modal para selec cuenta google
};

// Loguear con Email y password
export const singInWEP = (email, password) => firebase.auth().signInWithEmailAndPassword(email, password);

// Cerrar sesión
export const signOut = () => firebase.auth().signOut();