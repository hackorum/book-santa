import * as firebase from "firebase";
require("@firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyA4nXtB1b22rdyr0-S6RIindtvohtCgAU8",
  authDomain: "book-santa-93ae6.firebaseapp.com",
  projectId: "book-santa-93ae6",
  storageBucket: "book-santa-93ae6.appspot.com",
  messagingSenderId: "300137711941",
  appId: "1:300137711941:web:3774378041fc54343a562c",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
