/* eslint-disable eol-last */
/* eslint-disable max-len */
const datePublishPost = () => {
  const datePost = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  const timePost = {
    hour12: 'true', // para formato 12 horas
    hour: 'numeric',
    minute: 'numeric',
  };

  const date = new Date().toLocaleDateString('es-Es', datePost);
  const time = new Date().toLocaleTimeString('es-Es', timePost);
  const dateTime = `${date} ${time}`;

  return dateTime;
};

const orderDate = () => {
  const year = new Date().getFullYear();
  const month = `0${new Date().getMonth()}`.slice(-2);
  const day = `0${new Date().getDate()}`.slice(-2);
  const hour = `0${new Date().getHours()}`.slice(-2);
  const minute = `0${new Date().getMinutes()}`.slice(-2);
  const second = `0${new Date().getSeconds()}`.slice(-2);
  // eslint-disable-next-line radix
  return parseInt(`${year}${month}${day}${hour}${minute}${second}`, 0);
};

// Agrega objeto (datos del post) a la colección 'posts'
export const createNewPost = (photo, name, id, content, counterLikes, postImgUrl) => firebase.firestore().collection('posts').add({
  photo,
  name,
  id,
  content,
  counterLikes,
  date: datePublishPost(),
  orderDate: orderDate(),
  postImgUrl,
});

// Trae todos los post cada vez que se actualice
export const readAllPosts = (cb) => firebase.firestore().collection('posts')
  .orderBy('orderDate', 'desc')
  .onSnapshot((querySnapshot) => { // actualiza post
    const post = querySnapshot.docs.map((doc) => ({
      idPost: doc.id,
      ...doc.data(),
    }));
    cb(post);
  });

export const updateLike = (idpost, counterLikes) => firebase.firestore().collection('posts').doc(idpost).update({
  counterLikes,
});

// Actualiza post Editado
export const updatePost = (idpost, valueEdited) => firebase.firestore().collection('posts').doc(idpost).update({
  content: valueEdited,
});

export const deletePost = (id) => firebase.firestore().collection('posts').doc(id).delete();

// Agrega el objeto (datos del comentario) a la colección 'comments'
export const createComments = (idpost, photoComment, nameComment, idCommentUser, comment) => firebase.firestore().collection('comments').add({
  idpost,
  photoComment,
  nameComment,
  idCommentUser,
  comment,
  date: datePublishPost(),
  orderDate: orderDate(),
});

// Trae todos los comentarios cada vez que se actualice
export const readAllComments = (cb) => firebase.firestore().collection('comments')
  .orderBy('orderDate', 'desc')
  .onSnapshot((querySnapshot) => { // actualiza comments
    const comment = querySnapshot.docs.map((doc) => ({
      idComment: doc.id,
      ...doc.data(),
    }));
    cb(comment);
  });

export const deleteComments = (idcomment) => firebase.firestore().collection('comments').doc(idcomment).delete();