import * as firebase from "firebase";
import { createNativeWrapper } from "react-native-gesture-handler";
import { cos } from "react-native-reanimated";
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
  firebase.firestore().collection("user").doc(obj.id).set({
    userId: obj.id,
    userEmail: obj.email,
    userName: obj.name,
    profilePicture: obj.picture.data.url,
  });
};

const updateUser = (obj) => {
  firebase
    .firestore()
    .collection("user")
    .doc(obj.userId)
    .update({
      userName: obj.userName,
      profilePicture: obj.profilePicture
        ? obj.profilePicture
        : "https://icon-library.com/images/no-profile-pic-icon/no-profile-pic-icon-12.jpg",
      userPhoneNumber: obj.userPhoneNumber,
      health: obj.health,
      bloodpicker: obj.bloodpicker,
      role: obj.role,
      userLocation: obj.userLocation,
      userId: obj.userId,
    });
};
const storageRef = firebase.storage().ref();
const uploadToFirebase = (blob, userId) => {
  return new Promise((resolve, reject) => {
    storageRef
      .child(`uploads/${userId}photo.jpg`)
      .put(blob, {
        contentType: "image/jpeg",
      })
      .then((snapshot) => {
        blob.close();
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
const sigUpWithFirebase = async (userName, email, password, setReducer) => {
  try {
    const user = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    await firebase.firestore().collection("user").doc(user.user.uid).set({
      userName: userName,
      userEmail: email,
      userId: user.user.uid,
    });
    setReducer(user.user.uid);
  } catch (error) {}
};
const sigInWithFirebase = async (email, password) => {
  try {
    const user = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    return await firebase
      .firestore()
      .collection("user")
      .doc(user.user.uid)
      .get();
  } catch (error) {}
};
const getUser = (id) => {
  return firebase.firestore().collection("user").doc(id).get();
};
const getAllDonors = async () => {
  return await firebase.firestore().collection("user").where("role","==","Donor").get();
};
const joinChatRoom = async (senderId, recieverId) => {
  let checkRoom = await firebase
    .firestore()
    .collection("Chat")
    .where("senderId", "==", senderId)
    .where("recieverId", "==", recieverId)
    .get();
  let isChatRoomFound = false;
  checkRoom.forEach((x) => {
    isChatRoomFound = { ...x.data(), chatId: x.id };
  });
  if (isChatRoomFound) return isChatRoomFound;
  checkRoom = await firebase
    .firestore()
    .collection("Chat")
    .where("senderId", "==", recieverId)
    .where("recieverId", "==", senderId)
    .get();
  isChatRoomFound = false;
  checkRoom.forEach((x) => {
    isChatRoomFound = { ...x.data(), chatId: x.id };
  });
  if (isChatRoomFound) return isChatRoomFound;
  return await firebase.firestore().collection("Chat").add({
    senderId,
    recieverId,
  });
};
const sendMessage = async (chatId, userId, message, time) => {
  return await firebase
    .firestore()
    .collection("Chat")
    .doc(chatId)
    .collection("messages")
    .add({
      time: time,
      userId,
      message,
    });
};
const renderChat = async (chatId) => {
  await firebase
    .firestore()
    .collection("Chat")
    .doc(chatId)
    .collection("message")
    .get();
};

export {
  firebase,
  hello,
  updateUser,
  uploadToFirebase,
  getImageUrl,
  sigUpWithFirebase,
  sigInWithFirebase,
  getUser,
  getAllDonors,
  joinChatRoom,
  sendMessage,
  renderChat,
};
