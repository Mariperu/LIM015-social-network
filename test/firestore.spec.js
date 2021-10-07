/* eslint-disable max-len */
/* eslint-disable eol-last */
import MockFirebase from 'mock-cloud-firestore';

import {
  createNewPost,
  readAllPosts,
  updateLike,
  updatePost,
  deletePost,
  createComments,
  readAllComments,
  deleteComments,
} from '../src/firebase/firestore.js';

const fixtureData = {
  __collection__: {
    posts: {
      __doc__: {
        post001: { // post id
          photo: '../src/img/avatar.png',
          name: 'Fulanita1',
          id: '001', // user id
          content: 'busco botellas de plástico',
          counterLikes: [],
          date: '27 sept. 2021 11:05 a. m.',
          orderDate: '20210827110540',
          postImgUrl: '../src/img/arbol_ecologico.png',
        },
        post002: { // post id
          photo: '../src/img/avatar.png',
          name: 'Fulanita2',
          id: '002', // user id
          content: 'tengo botellas para reciclar',
          counterLikes: ['1', '2'],
          date: '27 sept. 2021 11:07 a. m.',
          orderDate: '20210827110740',
          postImgUrl: '../src/img/arbol_ecologico.png',
        },
        post003: { // post id
          photo: '../src/img/avatar.png',
          name: 'Fulanita3',
          id: '003', // user id
          content: 'Hola',
          counterLikes: [],
          date: '27 sept. 2021 11:09 a. m.',
          orderDate: '20210827110940',
          postImgUrl: '../src/img/arbol_ecologico.png',
        },
      },
    },
    comments: {
      __doc__: {
        comment001: { // comment id
          idpost: 'post002',
          photoComment: '../src/img/avatar.png',
          nameComment: 'Fulanita1',
          idCommentUser: '001', // user id
          comment: 'Estoy interesada, info por favor',
          date: '30 sept 2021 5:21 p. m',
          orderDate: '20210830172150',
        },
      },
    },
  },
};

// De manera global, firebase será reemp. por MockFirebase
global.firebase = new MockFirebase(fixtureData, {
  isNaiveSnapshotListenerEnabled: true, // activa snapshot (actualización en tiempo real)
});

// TEST POSTS
describe('Function createNewPost', () => {
  it('It should create a new post', () => {
    createNewPost('../src/img/avatar.png', 'Fulanita4', '004', 'busco papeles reciclados', [], '../src/img/arbol_ecologico.png')
      .then(() => {
        const cb = (post) => { // console.log(post);
          const result = post.find((elem) => elem.content === 'busco papeles reciclados');
          expect(result.content).toBe('busco papeles reciclados');
        };
        readAllPosts(cb);
      });
  });
});

describe('Function readAllPosts', () => {
  it('It should be a function', () => {
    expect(typeof readAllPosts).toBe('function');
  });
});

describe('Function updateLike', () => {
  it('It should update likes', () => {
    updateLike('post002', 2)
      .then(() => {
        const cb = (post) => {
          const result = post.find((elem) => elem.counterLikes === 2);
          expect(result.counterLikes).toBe(2);
        };
        readAllPosts(cb);
      });
  });
});

describe('Function updatePost', () => {
  it('It should edit a post', () => updatePost('post001', 'busco botellas de plástico Editado')
    .then(() => {
      const cb = (post) => { // console.log(post);
        const result = post.find((elem) => elem.content === 'busco botellas de plástico Editado');
        expect(result.content).toBe('busco botellas de plástico Editado');
      };
      readAllPosts(cb);
    }));
});

describe('Function deletePost', () => {
  it('It should delete a post', () => deletePost('post003') // post id
    .then(() => {
      const cb = (post) => { // console.log(post);
        const result = post.find((elem) => elem === 'post003');
        expect(result).toBe(undefined);
      };
      readAllPosts(cb);
    }));
});

// TEST COMMENTS

describe('Function createComments', () => {
  it('It should create a comment in a post', () => createComments('post002', '../src/img/avatar.png', 'Fulanita1', '001', 'Estoy interesada, info por favor')
    .then(() => {
      const cb = (comment) => { // console.log(post);
        const result = comment.find((elem) => elem.comment === 'Estoy interesada, info por favor');
        expect(result.comment).toBe('Estoy interesada, info por favor');
      };
      readAllComments(cb);
    }));
});

describe('Function readAllComments', () => {
  it('It should be a function', () => {
    expect(typeof readAllComments).toBe('function');
  });
});

describe('Function deleteComments', () => {
  it('It should delete a comment from post', () => deleteComments('comment001') // comment id
    .then(() => {
      const cb = (comment) => { // console.log(post);
        const result = comment.find((elem) => elem === 'comment001');
        expect(result).toBe(undefined);
      };
      readAllPosts(cb);
    }));
});