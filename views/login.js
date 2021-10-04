/* eslint-disable eol-last */
/* eslint-disable no-undef */
import {
  singInWEP,
  signInWithGoogle,
} from '../firebase/auth.js';

// Inicio de sesión con E-mail y contraseña
export const loginWEP = (document) => {
  const formLogin = mainContainer.querySelector('form');
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault(); // evita que se actualice la pag (? en url)

    const idEmailLogin = document.querySelector('#idEmailLogin').value;
    const idPasswordLogin = document.querySelector('#idPasswordLogin').value;
    const msgErrorLogin = document.querySelector('.msgErrorLogin');

    singInWEP(idEmailLogin, idPasswordLogin)
      .then((credentials) => {
        // console.log(credentials)
        const user = credentials.user;
        if (user.emailVerified === true) { // Valida si user aceptó correo de verificación
          window.location.hash = '#/home';
        } else {
          msgErrorLogin.textContent = 'Por favor verifique su correo e intente de nuevo';
        }
      }).catch((error) => {
        // console.log(error)
        if (error.code === 'auth/wrong-password') {
          msgErrorLogin.textContent = 'La contraseña es incorrecta, intenta nuevamente.';
        } else if (error.code === 'auth/user-not-found') {
          msgErrorLogin.textContent = 'El correo no corresponde a una cuenta registrada, intenta nuevamente.';
        } else {
          msgErrorLogin.textContent = 'Ha ocurrido un error. Intenta otra vez.';
        }
      });
  });
};

// Inicio de sesión con cuenta de Google
export const loginWithGoogle = (document) => {
  const idGoogleLogin = document.querySelector('#idGoogleLogin');
  idGoogleLogin.addEventListener('click', (e) => {
    e.preventDefault(); // evita que se actualice la pag (? en url)

    signInWithGoogle()
      .then(() => {
        // console.log(a);
        // console.log('Iniciáste sesión');
        window.location.hash = '#/home';
      }).catch((error) => {
        console.error(error);
      });
  });
};

export const loginView = () => {
  // /*html*/ extension VSC para mostrar templates HTML en JS.
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
          <input class="inputEmail" type="email" id="idEmailLogin" placeholder="Ingresa tu Email" required>
        </section>

        <section class="secPassword">
        <input class="inputPassword" type="password" id="idPasswordLogin" placeholder="Ingresa tu contraseña" required>
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

  // const year = new Date().getFullYear();
  // const month = `0${new Date().getMonth()}`.slice(-2);
  // console.log(year, month);
  // console.log(`${new Date()}`.slice(0, 25));

  return mainLogin;
};