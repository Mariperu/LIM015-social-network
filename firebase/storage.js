/* eslint-disable eol-last */
export const uploadImage = (file, location) => {
  const storageRef = firebase.storage().ref(`${location}/${file.name}`);
  return storageRef.put(file);
};