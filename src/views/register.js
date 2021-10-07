/* eslint-disable eol-last */
/* eslint-disable quotes */
/* eslint-disable max-len */
/* eslint-disable no-undef */
import {
  createUserWEP,
  signOut,
  signInWithGoogle,
} from '../firebase/auth.js';

// Verificar password
const verifyPass = ((pass) => {
  return pass.search(/(?=.*[a-z])(?=.*[0-9])(?=.*[@$#!?])[a-zA-Z0-9@$#!?]{8,32}/g) !== -1;
});

// Registro con Email and Password
const registerWEP = (docForm) => {
  const formRegister = mainContainer.querySelector('form');
  formRegister.addEventListener('submit', (e) => {
    e.preventDefault(); // detiene propagación de un evento (ejm: n submits) (? en url)

    const idNameRegister = docForm.querySelector('#idNameRegister').value;
    const idEmailRegister = docForm.querySelector('#idEmailRegister').value;
    const idPasswordRegister = docForm.querySelector('#idPasswordRegister').value;
    const msgErrorRegister = docForm.querySelector('.msgErrorRegister');

    if (verifyPass(idPasswordRegister) === false) {
      msgErrorRegister.textContent = 'Mínimo 8 caracteres (letras, números y carácter especial @$#!?)';
    } else {
      createUserWEP(idEmailRegister, idPasswordRegister)
        .then((userCredential) => {
          const user = userCredential.user;
          user.updateProfile({ // Actualiza datos del perfil de un usuario
            displayName: idNameRegister,
          });
          const configRegister = {
            url: 'http://localhost:5000/#/',
          };
          user.sendEmailVerification(configRegister) // retorna a la url
            .then(() => {
              alert("📧 Te enviamos un correo de verificación.");
            }).catch((error) => {
              console.log(error);
            });

          signOut(); // desloguea, primero valida correo y despues loguea correctamente desde login.
          window.location.hash = '#/';
        }).catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            msgErrorRegister.textContent = 'El correo ya esta registrado. Por favor intenta con otro correo.';
          } else {
            msgErrorRegister.textContent = 'Ha ocurrido un error. Intenta otra vez.';
          }
        });
    }
  });
};

// Registro con Google
const registerWithGoogle = (docForm) => {
  const idGoogle = docForm.querySelector("#idGoogle");
  idGoogle.addEventListener('click', () => {
    const msgErrorRegister = docForm.querySelector('.msgErrorRegister');

    signInWithGoogle().then((userCredential) => {
      const user = userCredential.user;
      window.location.hash = '#/home';
      return { // info de obj userCredential
        user,
        userEmail: user.email,
        userName: user.displayName,
        userPhoto: user.photoURL,
        userToken: user.refreshToken,
      };
    }).catch(() => {
      msgErrorRegister.textContent = "Ha ocurrido un error. Intenta otra vez.";
    });
  });
};

// Template html - register
export const registerView = () => {
  // eslint-disable-next-line spaced-comment
  const view = /*html*/ `
  <section class= "secViewDesktop">

    <section class= "secCover">
        <img class="imgCoverRegister" src="img/mundoverde6.png" alt="MundoVerde">
        <h1 class="textCover2"> Red que une a personas a intercambiar productos reciclados.</h1>
        <h1 class="textCover2"> Únete al cambio, seamos parte de un mundo mejor...</h1>
    </section>

    <section class= "secLogin">

      <section class= "secImgLogin">
        <img class="imgLogin" src="img/arbol_ecologico.png" alt="EcoPunto">
      </section>

      <h1 class="tittle">EcoPunto</h1>
      <h2 class="text">¡Vamos, crea tu cuenta green!</h2>

      <form class="formLogin" id="idRegister">

        <section class="secName">
          <input class="inputName" type="text" id="idNameRegister" placeholder="Ingresa tu nombre de usuario" required>
        </section>

        <section class="secEmail">
          <input class="inputEmail" type="email" id="idEmailRegister" placeholder="Ingresa tu Email" required>
        </section>

        <section class="secPassword">
          <input class="inputPassword" type="password" id="idPasswordRegister" placeholder="Ingresa tu contraseña"
          required>
        </section>
        <!-- Mensaje de error -->
        <section class="msgErrorRegister"></section>
        <!-- Botón submit - Registrar -->
        <input class="inputSubmit" type="submit" id="idSubmitRegister" value="Registrar">

      </form>

      <h2 class="textOne">O bien registra con...</h2>

      <section class="secIcons">
          <section class="secIconGoogle" id= "idGoogle">
            <a class="iconGoogle" alt="Google">
              <img class= "icon" src="./img/google.png" alt="Google">
            </a>
          </section>

          <section class="secIconFb">
            <a class="iconFb" alt="Facebook">
              <img class= "icon" id= "idFb" src="./img/facebook.png" alt="facebook">
            </a>
          </section>
      </section>

      <section class="secLinkRegister">
          <h2 class="textOne">¿Ya tienes una cuenta?</h2>
          <h2 class="textTwo" id= "textLogInHere"><a href='#/'>Inicia sesión aquí</a></h2>
      </section>

    </section>
  </section>`;

  const mainRegister = document.getElementById('mainContainer');
  mainRegister.innerHTML = '';
  mainRegister.innerHTML = view;

  registerWEP(mainRegister);
  registerWithGoogle(mainRegister);
  return mainRegister;
};