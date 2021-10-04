/* eslint-disable eol-last */
// import MockFirebase from 'mock-cloud-firestore';
import mockFirebase from './_mock_/fireMock.js';

import {
  uploadImage,
} from '../src/firebase/storage.js';

// global.firebase = new MockFirebase();
global.firebase = mockFirebase();

describe('Function uploadImage', () => {
  test('It should upload an img file', () => uploadImage('photo.jpg', 'pc user')
    .then((data) => {
      expect(data).toBe('The file photo.jpg was add to pc user/undefined');
      // done();
    }));
});