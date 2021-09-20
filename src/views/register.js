import {
  createUserWEP,
  signOut,
  signInWithGoogle,
  //signInWithFb,
  //createUser,
  //getUser,
} from "../firebase/auth.js";


// //Verificando password
const verifyPass = ((pass) => {
  return pass.search(/(?=.*[a-z])(?=.*[0-9])(?=.*[@$#!?])[a-zA-Z0-9@$#!?]{8,32}/g) !== -1;
});


//Registro con Email y idPassword Register
const registerWEP = (document) => {
  const goRegister = mainContainer.querySelector('form');
  goRegister.addEventListener('submit', (e) => {
    e.preventDefault();
    const idNameRegister = document.querySelector('#idNameRegister').value;
    const idEmailRegister = document.querySelector('#idEmailRegister').value;
    const idPasswordRegister = document.querySelector('#idPasswordRegister').value;
    const msgErrorRegister = document.querySelector('.msgErrorRegister');

    if (verifyPass(idPasswordRegister) === false) {
      msgErrorRegister.innerHTML = `<p class="textError">Mínimo 8 caracteres, incluye un número y un carácter especial $#@!?</p>`;
    } else {
      createUserWEP(idEmailRegister, idPasswordRegister)
        .then((credentials) => {
          const user = credentials.user;
          user.updateProfile({
            displayName: idNameRegister,
          });
          const configRegister = {
            url: 'http://localhost:5000/#/'
          };
          user.sendEmailVerification(configRegister)
            .then(() => {
              alert("Te enviamos un correo de verificación.")
            }).catch((error) => {
              console.log(error);
            });

          signOut();
          window.location.hash = '#/';
        }).catch((err) => (err.code === 'auth/email-already-in-use' ?
          msgErrorRegister.textContent = "El correo ya esta registrado. Por favor intenta con otro correo." :
          msgErrorRegister.textContent = "Ha ocurrido un error. Intenta otra vez."));
    }
  })
};


const registerWithGoogle = (document) => {
  const idGoogle = document.querySelector("#idGoogle");
  idGoogle.addEventListener('click', () => {
    const msgErrorRegister = document.querySelector('.msgErrorRegister');

    signInWithGoogle()
      .then((credentials) => {
        //console.log(credentials)
        const user = credentials.user;
        window.location.hash = '#/home';

        return {
          user,
          userEmail: user.email,
          userName: user.displayName,
          userPhoto: user.photoURL,
          userToken: user.refreshToken,
        };
      }).catch(() => {
        msgErrorRegister.textContent = "Ha ocurrido un error. Intenta otra vez.";
      })
  });
}


// const registerWithFb = (document) => {
//   const idFb = document.querySelector("#idFb");
//   idFb.addEventListener('click', () => {
//     const msgErrorRegister = document.querySelector('.msgErrorRegister');

//     signInWithFb()
//       .then((credentials) => {
//         //console.log(credentials)
//         const user = credentials.user;
//         window.location.hash = '#/home';

//         return {
//           user,
//           userEmail: user.email,
//           userName: user.displayName,
//           userPhoto: user.photoURL,
//           userToken: user.refreshToken,
//         };
//       }).catch(() => {
//         msgErrorRegister.textContent = "Ha ocurrido un error. Intenta otra vez.";
//       })
//   });
// }


export const registerView = () => {
  const view = `
  <section class= "secViewDesktop">
  <section class= "secCover">
  <img class="imgCoverRegister" src="img/mundoverde.png" alt="MundoVerde">
  </section>
    <section class= "secLogin">
    <!--<form class="formLogin" id="idRegister">-->

    <section class= "secImgLogin">
      <img class="imgLogin" src="img/arbol_ecologico.png" alt="EcoPunto">
    </section>
      <h1 class="tittle">EcoPunto</h1>
      <h2 class="text">¡Vamos, crea tu cuenta green!</h2>

      <form class="formLogin" id="idRegister">

      <section class="secName">
      <i class="fa fa-user icon"></i>
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

      <!--</form>-->
  </section>
  
  
  </section>
  `;

  const mainRegister = document.getElementById('mainContainer');
  mainRegister.innerHTML = '';
  mainRegister.innerHTML = view;

  registerWEP(mainRegister);
  registerWithGoogle(mainRegister);
  //registerWithFb(mainRegister);
  return mainRegister;
}