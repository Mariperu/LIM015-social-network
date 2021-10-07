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
const logOut = (docHome) => {
  const idOut = docHome.querySelector('#idOut');
  idOut.addEventListener('click', () => {
    signOut();
    alert('🌳 Cerrando sesión. \n Vuelve pronto. 👋');
  });
};

// Crear post
const createPost = (docHome) => {
  const user = userInfo();
  const idPublishBox = docHome.querySelector('#idPublishBox');

  const idButtonPublish = docHome.querySelector('#idButtonPublish');
  idButtonPublish.addEventListener('click', (e) => {
    e.preventDefault(); // capta un evento a la vez
    const postContent = docHome.querySelector('#idPublishBoxText').value;
    const msgErrorPublish = docHome.querySelector('.errorPublish');

    if (postContent.charAt(0) === ' ' || postContent === '') { // [0]
      msgErrorPublish.textContent = 'Por favor rellena el campo antes de publicar.';
    } else {
      msgErrorPublish.textContent = '';

      const fileImg = docHome.querySelector('#fileImg');
      const image = fileImg.files[0]; // capta img a cargar = true

      if (image) { // post con img + text
        const uploadTask = uploadImage(image, 'photos');
        uploadTask.on('state_changed', // observador
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error(error);
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((postImgUrl) => {
              createNewPost(user.photo, user.name, user.id, postContent, [], postImgUrl) // [] likes
                .then(() => {
                  idPublishBox.reset(); // restaura textarea
                }).catch((error) => console.log(error));
            });
          });
      } else { // post con text
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

// Editar y eliminar post
const editAndDeletePost = (secEditDelete, user) => {
  const secUserSelect = secEditDelete.querySelector('.secUserSelect');
  const section = document.createElement('section');
  section.classList.add('hide');

  const menuPost = secEditDelete.querySelector('.show');
  menuPost.addEventListener('click', (e) => { // ...
    e.preventDefault();

    // template html - edit/elim post
    // eslint-disable-next-line spaced-comment
    const editDeleteView = /*html*/ `
    <ul class="modalMenu">
      <li idpost="${user.idPost}" class="editPost">
        <span class="iconify" data-icon="emojione-v1:lower-left-pencil"></span>Editar</li>
        <strong>|</strong>
      <li class="liDeletePost"><span class="iconify" data-icon="noto:wastebasket"></span>Borrar</li>
    </ul>`;
    section.innerHTML = editDeleteView;
    secUserSelect.appendChild(section);
    section.classList.toggle('hide'); // click, muestra template

    // 1. Editar post
    const saveIcon = secEditDelete.querySelector('.saveIcon');
    const editPost = secEditDelete.querySelector('.editPost'); // li
    editPost.addEventListener('click', () => {
      const publishedText = secEditDelete.querySelector('.publishedText');
      publishedText.contentEditable = 'true'; // mét. para editar
      publishedText.focus();
      saveIcon.classList.remove('hide');
      saveIcon.style.display = 'block';
    });
    saveIcon.addEventListener('click', () => {
      const publishedText = secEditDelete.querySelector('.publishedText');
      const idPosts = editPost.getAttribute('idpost');
      const textPostEdited = publishedText.innerText.trim(); // elim. blanks
      if (textPostEdited !== '') {
        publishedText.contentEditable = 'false';
        saveIcon.classList.add('hide');
        section.classList.toggle('hide');

        updatePost(idPosts, textPostEdited); // actualiza post edit.
      }
    });

    // 2. Eliminar post
    const deletePostBtn = secEditDelete.querySelector('.liDeletePost');
    deletePostBtn.addEventListener('click', () => {
      const EditDeleteMenu = secEditDelete.querySelector('.modalMenu');
      EditDeleteMenu.classList.add('hide');
      // eslint-disable-next-line spaced-comment
      const deleteView = /*html*/ `
        <p class="pDeleteMenu">¿Desea borrar el post?</p>
        <ul class="deleteMenu">
          <li id="idYes"><i class="fas fa-check"></i>Si</li>
          <li id="idNo"><i class="fas fa-times"></i>No</li>
        </ul>`;
      section.innerHTML = '';
      section.innerHTML = deleteView;

      const idYes = secEditDelete.querySelector('#idYes');
      const idNo = secEditDelete.querySelector('#idNo');
      idYes.addEventListener('click', () => deletePost(user.idPost)
        .then((resp) => resp)
        .catch((err) => console.error(err)));
      idNo.addEventListener('click', () => {
        section.classList.add('hide');
      });
    });
  });
};

// Crear comentario
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
    if (descriptionComment.charAt(0) === ' ' || descriptionComment === '') { // [0]
      errorComment.textContent = 'Por favor escribir un comentario';
    } else {
      createComments(idCommentPost, photoCommentUser, userNameAt, userIdAt, descriptionComment);
      createComment.reset();
      errorComment.textContent = '';
    }
  });
};

// Publicar y eliminar comentario
const readPostComments = (secHome) => {
  readAllComments((comments) => {
    const newComment = secHome.querySelector('.newComment');
    newComment.innerHTML = '';

    comments.forEach((com) => {
      const sectionComment = document.createElement('section');
      const sendCommentForm = secHome.querySelector('.sendCommentForm');
      const idCommentPost = sendCommentForm.getAttribute('idCommentPost');
      if (com.idpost === idCommentPost) {
        sectionComment.classList.add('newComment');

        // Template html - comment
        // eslint-disable-next-line spaced-comment
        sectionComment.innerHTML = /*html*/ `
          <section class="readComment">
            <section class="userReadComment">
              <img class="imageCircle" alt="userimage" src="${com.photoComment}">
              <h2 class="userName">${com.nameComment}</h2>
              <span class="dateComment">${com.date}</span>
            </section>
          <p class="readCommentp">${com.comment}</p>
          </section>
            <section class="userSelectComment">
                <span class="deleteComment"><i class="fas fa-trash-alt"></i> Borrar</span>
            </section>
          </section> `;

        // Eliminar comentario
        const deleteComment = sectionComment.querySelector('.deleteComment');
        deleteComment.addEventListener('click', () => {
          deleteComments(com.idComment);
        });
      }
      // Crear comentario
      newComment.appendChild(sectionComment);
    });
  });
};

// Contar "likes"
const countLikesPost = (secLikes, post, user) => {
  const startLike = secLikes.querySelector('.fa-heart');
  startLike.addEventListener('click', () => {
    let counter = post.counterLikes; // []

    if (!counter.includes(user.id)) { // +
      startLike.classList.replace('far', 'fas'); // vacío/pintado
      counter.push(user.id);
      updateLike(post.idPost, counter); // registra conteo
    } else if (counter.includes(user.id)) { // -
      startLike.classList.replace('fas', 'far');
      counter = counter.filter((elems) => elems !== user.id);
      updateLike(post.idPost, counter);
    }
  });
};

// Template html - post
const postView = (post, user) => {
  // eslint-disable-next-line spaced-comment
  const view = /*html*/ `
  <section class="secHeadPost">
    <section class="secInfoUserPost">
      <img class="imgUserPost" src=${post.photo} alt="userImage">
      <section class="nameAndDatePost">
        <h2 class="userNamePost">${post.name}</h2>
        <p class="datePost">${post.date}</p>
      </section>
    </section>
  </section>

  <section class="secMainPost">
      <section class="secDescriptionPost">
          <section>
            <p id="${post.idPost}" class="publishedText">${post.content}</p>
            <span idSaveIcon="${post.idPost}" class="saveIcon hide"><i class="fas fa-save"></i> Guardar</span>
          </section>
          ${post.postImgUrl ? `<img  class="postImg" src=${post.postImgUrl} alt="postURLImg">` : ''}
      </section>

      <section class="secInteractionPost">

          <!--*Likes*-->
          <section id= "iconLike" class="iconPost">
              <span class = "iconColor">
              <i class="${post.counterLikes.includes(user.id) ? 'fas' : 'far'} fa-heart"></i></span>
              <p>${post.counterLikes.length ? post.counterLikes.length : ''} </p>
          </section>

          <section class="iconPost">
              <span class="iconify" data-icon="ci:share" data-width="18" data-height="18"></span>
          </section>

          <!--*Edit/Del post*-->
          <section class="iconPost secUserSelect" >
              <span class="iconMenuPost ${post.id === user.id ? 'show' : 'hide'}">
                  <i class="fas fa-ellipsis-v"></i>
              </span>
          </section>

      </section>

    <form class="createComment hide" id="idFormCreateComment"
        idCommentPost1="${post.idPost}" userId="${user.id}" userName="${user.name}" >

        <img class="imgUserPostComment" alt="userimage1" src="${user.photo}">
        <textarea id="descriptionComment" class="textComment" cols="35"
          placeholder="Dejame un comentario..."></textarea>
        <i idCommentPost="${post.idPost}" class="sendCommentForm fas fa-paper-plane"></i>
    </form>

    <section class="errorComment"></section>
    <section class="newComment"></section>
  </section>`;
  return view;
};

// Template html - Home
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
        <p class="nameUser1"><i class="fas fa-mobile-alt"></i> 999 876 543</p>
        <p class="nameUser1"><i class="fas fa-recycle"></i> Botellas de plástico, papel reciclado</p>
        <p class="nameUser1"><i class="fas fa-map-marker-alt"></i> Lima</p>
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
          </figure>

          <button class="inputShare"  id="idButtonPublish" type="button">Publicar</button>
        </section>

      </form>

    </section>
  </section>

  <section class="secHomePost"></section>

  <footer class="secFooter" id="idSecFooter">
  ©2021 Developed by&nbsp;<a href="https://github.com/nanita462" target="_blank">Ana Aguilera&nbsp;</a>and
  <a href="https://github.com/Mariperu" target="_blank">&nbsp;Maritza Rodriguez.</a>
  </footer>
  `;

  const mainHome = document.getElementById('mainContainer');
  mainHome.innerHTML = '';
  mainHome.innerHTML = view;

  logOut(mainHome);
  createPost(mainHome);

  readAllPosts((posts) => { // Trae todos los post
    const secHomePost = mainHome.querySelector('.secHomePost');
    secHomePost.innerHTML = '';
    posts.forEach((post) => {
      const secUniquePost = document.createElement('section');
      secUniquePost.classList.add('newPost');
      secUniquePost.innerHTML = postView(post, user); // template post

      if (post.id === user.id) {
        editAndDeletePost(secUniquePost, post);
      }
      countLikesPost(secUniquePost, post, user);
      postComments(secUniquePost);
      readPostComments(secUniquePost);
      secHomePost.appendChild(secUniquePost);
    });
  });

  return mainHome;
};