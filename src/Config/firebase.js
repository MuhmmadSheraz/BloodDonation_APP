import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDtZSwRW5cwN9JpMfJ2u7XEOy3dcFFcrzg",
  authDomain: "blooddonationapp-d2f79.firebaseapp.com",
  databaseURL: "https://blooddonationapp-d2f79.firebaseio.com",
  projectId: "blooddonationapp-d2f79",
  storageBucket: "blooddonationapp-d2f79.appspot.com",
  messagingSenderId: "444821098073",
  appId: "1:444821098073:web:649e42e3b2a1e50ea0ab48",
  measurementId: "G-4EFERKZ5YM",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// Initialize Firebase

//Functions

const hello = (obj) => {
  console.log("Hello Function", obj);
  firebase.firestore().collection("user").doc(obj.id).set({
    userId: obj.id,
    userEmail: obj.email,
    userName: obj.name,
    profilePicture: obj.picture.data.url,
  });
};
const updateUser = (obj) => {
  console.log("object from Firebase", obj);
  firebase.firestore().collection("user").doc(obj.userId).update({
    userName: obj.userName,
    profilePicture: obj.profilePicture,
    userPhoneNumber: obj.userPhoneNumber,
    health: obj.health,
    bloodpicker: obj.bloodpicker,
    userLocation: obj.userLocation,
    userId: obj.userId,
  });
};
const storageRef = firebase.storage().ref();
const uploadToFirebase = (blob, userId) => {
  console.log(blob);
  return new Promise((resolve, reject) => {
    storageRef
      .child(`uploads/${userId}photo.jpg`)
      .put(blob, {
        contentType: "image/jpeg",
      })
      .then((snapshot) => {
        console.log("snapShot firebase", snapshot);

        blob.close();
        console.log(snapshot);
        resolve(snapshot);
      })

      .catch((error) => {
        reject(error);
      });
  });
};
const getImageUrl = async ({ userId }) => {
  return storageRef
    .child(`uploads/${userId}photo.jpg`)
    .getDownloadURL()
    .then(function (url) {
      return url;
    });
};
export { firebase, hello, updateUser, uploadToFirebase, getImageUrl };
