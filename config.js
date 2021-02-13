import * as firebase from "firebase";
require("@firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyC0IuLGYN3dgxC0fByTu0nCiqjVFragT-Y",
  authDomain: "book-santa-91230.firebaseapp.com",
  projectId: "book-santa-91230",
  storageBucket: "book-santa-91230.appspot.com",
  messagingSenderId: "22592954188",
  appId: "1:22592954188:web:dce211d64db987104839e9",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
