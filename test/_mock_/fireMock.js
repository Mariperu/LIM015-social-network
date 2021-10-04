/* eslint-disable eol-last */

const storage = () => ({
  ref: (location) => ({
    put: (file) => new Promise((resolve) => {
      resolve(`The file ${file} was add to ${location}`);
    }),
  }),
});

const firebase = {
  storage,
};

// Método de Jest para crear funciones fake "mocks"
export default jest.fn(() => firebase);