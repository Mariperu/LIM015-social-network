/* eslint-disable eol-last */
/* eslint-disable no-undef */
import {
  singInWEP,
  signInWithGoogle,
} from '../firebase/auth.js';

// Logueo con Email and Password
export const loginWEP = (docForm) => {
  const formLogin = mainContainer.querySelector('form');
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault(); // detiene propagación de un evento (ejm: n submits) (? en url)

    const idEmailLogin = docForm.querySelector('#idEmailLogin').value;
    const idPasswordLogin = docForm.querySelector('#idPasswordLogin').value;
    const msgErrorLogin = docForm.querySelector('.msgErrorLogin');

    singInWEP(idEmailLogin, idPasswordLogin)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.emailVerified === true) { // Valida si user aceptó correo de verificación
          window.location.hash = '#/home';
        } else {
          msgErrorLogin.textContent = 'Por favor valida tu cuenta antes de ingresar';
        }
      }).catch((error) => {
        if (error.code === 'auth/wrong-password') {
          msgErrorLogin.textContent = 'La contraseña es incorrecta, intenta nuevamente.';
        } else if (error.code === 'auth/user-not-found') {
          msgErrorLogin.textContent = 'El correo no se encuentra registrado, intenta nuevamente.';
        } else {
          msgErrorLogin.textContent = 'Ha ocurrido un error. Intenta otra vez.';
        }
      });
  });
};

// Logueo con Google
export const loginWithGoogle = (docForm) => {
  const idGoogleLogin = docForm.querySelector('#idGoogleLogin');
  idGoogleLogin.addEventListener('click', (e) => {
    e.preventDefault(); // detiene propagación de un evento (ejm: n submits) (? en url)

    signInWithGoogle().then(() => {
      window.location.hash = '#/home';
    }).catch((error) => {
      console.error(error);
    });
  });
};

// Template html - logIn
export const loginView = () => {
  // eslint-disable-next-line spaced-comment
  const view = /*html*/ `
  <section class= "secViewDesktop">

      <section class= "secCover">
          <img class="imgCover" src="img/mundoverde4.png" alt="MundoVerde">
          <h1 class="textCover"> Ayudando a </h1>
          <h1 class="textCover"> Reducir, Reciclar y Reutilizar...</h1>
      </section>

      <section class= "secLogin">
        <section class= "secImgLogin">
            <img class="imgLogin" src="img/arbol_ecologico.png" alt="EcoPunto">
        </section>

        <h1 class="tittle">EcoPunto</h1>
        <h2 class="text">¡Bienvenid@ al mundo green!</h2>

        <form class="formLogin" id="idLogin">
          <section class="secEmail">
              <input class="inputEmail" type="email" id="idEmailLogin"
              placeholder="Ingresa tu Email" required>
          </section>

          <section class="secPassword">
              <input class="inputPassword" type="password" id="idPasswordLogin"
              placeholder="Ingresa tu contraseña" required>
          </section>

          <!-- Mensaje de error -->
          <section class="msgErrorLogin"></section>
          <!-- Botón submit - enviar -->
          <input class="inputSubmit" type="submit" id="idSubmit" value="Ingresar">

        </form>

        <h2 class="textOne">O bien ingresa con...</h2>

        <section class="secIcons">
          <section class="secIconGoogle" id= "idGoogleLogin">
              <a class="iconGoogle"  alt="Google">
                <img class= "icon" src="./img/google.png" alt="Google">
              </a>
          </section>

          <section class="secIconFb">
              <a class="iconFb" href="#" alt="Facebook">
                <img class= "icon" src="./img/facebook.png" alt="facebook">
              </a>
          </section>
        </section>

        <section class="secLinkRegister">
          <h2 class="textOne">¿No tienes una cuenta?</h2>
          <h2 class="textTwo" id="textRegisterHere"><a href='#/register'>Registrate aqui</a></h2>
        </section>

      </section>
  </section>`;

  const mainLogin = document.getElementById('mainContainer');
  mainLogin.innerHTML = '';
  mainLogin.innerHTML = view;

  loginWEP(mainLogin);
  loginWithGoogle(mainLogin);
  return mainLogin;
};