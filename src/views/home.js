/* eslint-disable eol-last */
import {
  signOut,
} from '../firebase/auth.js';
import {
  userInfo,
} from '../firebase/authh.js';

import {
  createNewPost,
  readAllPosts,
  updateLike,
  deletePost,
  updatePost,
  createComments,
  readAllComments,
  deleteComments,
} from '../firebase/firestore.js';

import {
  uploadImage,
} from '../firebase/storage.js';

// Cerrar Sesión
const logOut = (document) => {
  const idOut = document.querySelector('#idOut');
  idOut.addEventListener('click', () => {
    signOut();
    // console.log(signOut());
    alert('Cerrando sesión. :(');
  });
};

// Crear post
const createPost = (document) => {
  const idButtonPublish = document.querySelector('#idButtonPublish');
  const idPublishBox = document.querySelector('#idPublishBox');
  const user = userInfo();

  idButtonPublish.addEventListener('click', (e) => {
    e.preventDefault();

    const postContent = document.querySelector('#idPublishBoxText').value;
    const msgErrorPublish = document.querySelector('.errorPublish');

    if (postContent.charAt(0) === ' ' || postContent === '') {
      msgErrorPublish.textContent = 'Por favor rellena el campo antes de publicar.';
    } else {
      const fileImg = document.querySelector('#fileImg');
      const image = fileImg.files[0];
      if (image) {
        const uploadImg = uploadImage(image, 'photos');
        uploadImg.on( // Cargando imagen de pc
          'state_changed',
          (snapshot) => {
            const loadingImg = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${loadingImg}% done`);
          },
          (error) => {
            console.error(error);
          },
          () => {
            uploadImg.snapshot.ref.getDownloadURL().then((postImgUrl) => {
              createNewPost(user.photo, user.name, user.id, postContent, [], postImgUrl)
                .then(() => {
                  // msgErrorPublish.classList.add('hide');
                  idPublishBox.reset();
                }).catch((error) => console.log(error));
            });
          },
        );
      } else {
        createNewPost(user.photo, user.name, user.id, postContent, [], '')
          .then(() => {
            msgErrorPublish.classList.add('hide');
            idPublishBox.reset();
          })
          .catch((error) => console.log(error));
      }
    }
  });
};

// EDITAR Y ELIMINAR
const editAndDeletePost = (secElem, user) => {
  const menuPost = secElem.querySelector('.show');
  const secUserSelect = secElem.querySelector('.secUserSelect');
  const section = document.createElement('section');
  section.classList.add('hide');
  menuPost.addEventListener('click', (e) => {
    e.preventDefault();

    // Modal para editar/ elim post
    const modal = `<ul class="modalMenu">
          <li idpost="${user.idPost}" class="editPost">
          <span class="iconify" data-icon="emojione-v1:lower-left-pencil"></span>Editar</li>
          <strong>|</strong>
          <li class="liDeletePost"><span class="iconify" data-icon="noto:wastebasket"></span>Borrar</li>
          </ul>`;
    section.innerHTML = modal;
    secUserSelect.appendChild(section);
    section.classList.toggle('hide');

    // eliminar post
    const deleteBtn = secElem.querySelector('.liDeletePost');
    deleteBtn.addEventListener('click', () => {
      const modalMenu = secElem.querySelector('.modalMenu');
      modalMenu.classList.add('hide');
      const newModal = `
              <p class="pDeleteMenu">¿Desea borrar el post?</p>
              <ul class="deleteMenu">
                <li id="idYes"><i class="fas fa-check"></i>Si</li>
                <li id="idNo"><i class="fas fa-times"></i>No</li>
              </ul>`;
      section.innerHTML = '';
      section.innerHTML = newModal;
      const idYes = secElem.querySelector('#idYes');
      const idNo = secElem.querySelector('#idNo');
      idYes.addEventListener('click', () => deletePost(user.idPost)
        .then((resp) => resp)
        .catch((err) => console.error(err)));
      idNo.addEventListener('click', () => {
        section.classList.add('hide');
      });
    });

    // editar post
    const editPost = secElem.querySelector('.editPost');
    const saveIcon = secElem.querySelector('.saveIcon');
    editPost.addEventListener('click', () => {
      saveIcon.style.display = 'block';
      const publishedText = secElem.querySelector('.publishedText');
      publishedText.contentEditable = 'true'; // mét. para editar
      publishedText.focus();
      saveIcon.classList.remove('hide');
    });
    saveIcon.addEventListener('click', () => {
      const publishedText = secElem.querySelector('.publishedText');
      const idPosts = editPost.getAttribute('idpost');
      const textPostEdited = publishedText.innerText.trim();
      if (textPostEdited !== '') {
        publishedText.contentEditable = 'false';
        saveIcon.classList.add('hide');
        section.classList.toggle('hide');
        updatePost(idPosts, textPostEdited);
      }
    });
  });
};

// CREANDO COMENTARIOS ************************
const postComments = (post) => {
  const errorComment = post.querySelector('.errorComment');
  const sendCommentForm = post.querySelector('.sendCommentForm');
  const idCommentPost = sendCommentForm.getAttribute('idCommentPost');
  const imgUserPostComment = post.querySelector('.imgUserPostComment');
  const photoCommentUser = imgUserPostComment.getAttribute('src');
  const createComment = post.querySelector('.createComment');
  const userNameAt = createComment.getAttribute('userName');
  const userIdAt = createComment.getAttribute('userId');
  sendCommentForm.addEventListener('click', (e) => {
    e.preventDefault();
    const descriptionComment = post.querySelector('#descriptionComment').value;
    if (descriptionComment.charAt(0) === ' ' || descriptionComment === '') {
      errorComment.textContent = 'Por favor escribir un comentario';
    } else {
      createComments(idCommentPost, photoCommentUser, userNameAt, userIdAt, descriptionComment);
      createComment.reset();
    }
  });
};

// Publicar y editar/eliminar comentario
const readPostComments = (post) => {
  readAllComments((comments) => {
    const newComment = post.querySelector('.newComment');
    // const errorComment = post.querySelector('.errorComment');
    newComment.innerHTML = '';
    comments.forEach((element) => {
      const sectionElemComment = document.createElement('section');
      const sendCommentForm = post.querySelector('.sendCommentForm');
      const idCommentPost = sendCommentForm.getAttribute('idCommentPost');
      if (element.idpost === idCommentPost) {
        sectionElemComment.classList.add('newComment');
        sectionElemComment.innerHTML = `
          <section class="readComment">
            <section class="userReadComment">
              <img class="imageCircle" alt="userimage" src="${element.photoComment}">
              <h2 class="userName">${element.nameComment}</h2>
              <span class="dateComment">${element.date}</span>
           </section>
           <p class="readCommentp">${element.comment}</p>
          </section>
            <section class="userSelectComment">
                <span class="deleteComment"><i class="fas fa-trash-alt"></i> Borrar</span>
            </section>
          </section> `;
        // const buttonMenuComment = sectionElemComment.querySelector('#buttonMenuComment');
        const deleteComment = sectionElemComment.querySelector('.deleteComment');
        deleteComment.addEventListener('click', () => {
          // deleteComment.classList.toggle('show');
          // deleteComment.addEventListener('click', () => {
          //   console.log('holi');
          deleteComments(element.idComment);
          // });
          // errorComment.classList.add('hidex');
        });
      }
      newComment.appendChild(sectionElemComment);
    });
  });
};

// Funcion contar likes
const countLikesPost = (secElement, elem, user) => {
  const startLike = secElement.querySelector('.fa-heart');
  startLike.addEventListener('click', () => {
    let counter = elem.counterLikes;
    if (!counter.includes(user.id)) {
      startLike.classList.replace('far', 'fas');
      counter.push(user.id);
      updateLike(elem.idPost, counter);
    } else if (counter.includes(user.id)) {
      startLike.classList.replace('fas', 'far');
      counter = counter.filter((i) => i !== user.id);
      updateLike(elem.idPost, counter);
    }
  });
};

// TEMPLATE DE POST PUBLICADO
const postView = (elem, user) => {
  // eslint-disable-next-line spaced-comment
  const view = /*html*/ `
  <section class="secHeadPost">
    <section class="secInfoUserPost">
      <img class="imgUserPost" src=${elem.photo} alt="userImage">
      <section class="nameAndDatePost">
        <h2 class="userNamePost">${elem.name}</h2>
        <p class="datePost">${elem.date}</p>
      </section>
    </section>
  </section>

  <section class="secMainPost">
      <section class="secDescriptionPost">
          <section>
            <p id="${elem.idPost}" class="publishedText">${elem.content}</p>
            <!-- ICONO GUARDAR POST EDIT ***-->
            <span idSaveIcon="${elem.idPost}" class="saveIcon hide"><i class="fas fa-save"></i> Guardar</span>
          </section>
          ${elem.postImgUrl ? `<img  class="postImg" src=${elem.postImgUrl} alt="postImg">` : ''}
      </section>

      <section class="secInteractionPost">
          <!-- SECCION LIKES ***-->
          <section id= "iconLike" class="iconPost">
              <span class = "iconColor">
              <i class="${elem.counterLikes.includes(user.id) ? 'fas' : 'far'} fa-heart"></i></span>
              <p>${elem.counterLikes.length ? elem.counterLikes.length : ''} </p>
          </section>

          <section class="iconPost">
              <span class="iconify" data-icon="ci:share" data-width="18" data-height="18"></span>
          </section>

          <!--***SECCION EDIT/DELETE POST***-->
          <section class="iconPost secUserSelect" >
              <span class="iconMenuPost ${elem.id === user.id ? 'show' : 'hide'}">
                  <i class="fas fa-ellipsis-v"></i>
              </span>
          </section>

      </section>

    <form class="createComment hide" id="idFormCreateComment"
        idCommentPost1="${elem.idPost}" userId="${user.id}" userName="${user.name}" >
        <img class="imgUserPostComment" alt="userimage1" src="${user.photo}">
        <textarea id="descriptionComment" class="textComment" cols="35"
          placeholder="Dejame un comentario..."></textarea>
        <i idCommentPost="${elem.idPost}" class="sendCommentForm fas fa-paper-plane"></i>
    </form>

    <section class="errorComment error"></section>
    <section class="newComment hidex "></section>

  </section>`;
  return view;
};

// HOME
export const homeView = (user) => {
  // eslint-disable-next-line spaced-comment
  const view = /*html*/ `
  <header class="secHeader" id="idHeader">

    <section class="secLogoText" id="idNavList">
      <a class="logoText" href='#/home'>EcoPunto</a>
    </section>

    <section class="navbar" id="idNavList">
      <a href="#/home">
        <span data-width="25"class="iconify" data-icon="bx:bxs-home-heart"></span>Inicio</a>
      <a href="#/profile">
        <span data-width="25" class="iconify" data-icon="mdi:account-circle"></span>Mi perfil</a>
      <a id="idOut" href="#/">
        <span data-width="25" class="iconify" data-icon="ic:outline-log-in"></span>Cerrar sesión</a>
    </section>
  </header>

  <section class="secHome">

    <section class="secUserInfo">

      <section class="secImgProfile">
        <img class="imgProfile" src="${user.photo}" alt="ImgProfile" style= border-radius: 90px;>
      </section>

      <section class="secTextInfo">
        <h2 class="nameUser">${user.name}</h2>
        <p class="nameUser1">Celular: 999 876 543</p>
        <p class="nameUser1">Producto: Botellas de plástico</p>
        <p class="nameUser1">Ubicación: Lima</p>
      </section>

    </section>

    <section class="secHomePublish">

      <form class="secPublishBox" id="idPublishBox">

        <textarea class="boxText" name="" id="idPublishBoxText"
        placeholder="¿Qué quieres compartir?"></textarea>
        <!-- Mensaje de error -->
        <section class="errorPublish"></section>

        <section class="secBtnBoxText" id="idBoxText">
          <figure class="imgFile">
            <span id= "iconFile" class="iconify" data-icon="noto-v1:framed-picture"
            data-width="25" data-height="25"></span>
            <input type="file" id="fileImg" accept="image/png, image/jpg, image/jpeg"/>

            <!--verificar***-->
            <section class="hoverPhoto"></section>
          </figure>
          <!--<button class="inputShare"  id="idButtonDelete" type="button">Borrar</button>-->
          <button class="inputShare"  id="idButtonPublish" type="button">Publicar</button>
        </section>

        <section class="timelinePosts"></section>

      </form>

    </section>
  </section>

  <section class="secHomePost"></section>

  <!--<footer class="secFooter" id="idSecFooter">
  ©2021 Developed by <a href="https://github.com/nanita462" target="_blank">Ana Aguilera </a>
  and<a href="https://github.com/Mariperu" target="_blank"> Maritza Rodriguez</a>
  </footer>-->
  `;

  const mainHome = document.getElementById('mainContainer');
  mainHome.innerHTML = '';
  mainHome.innerHTML = view;

  createPost(mainHome);
  logOut(mainHome);

  readAllPosts((posts) => {
    const secHomePost = mainHome.querySelector('.secHomePost');
    secHomePost.innerHTML = '';
    posts.forEach((post) => {
      const secElem = document.createElement('section');
      secElem.classList.add('newPost');
      secElem.innerHTML = postView(post, user);

      if (post.id === user.id) {
        editAndDeletePost(secElem, post);
      }
      countLikesPost(secElem, post, user);
      postComments(secElem);
      readPostComments(secElem);
      secHomePost.appendChild(secElem);
    });
  });

  return mainHome;
};