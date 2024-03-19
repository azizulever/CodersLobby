// Import the functions you need from the SDKs you need
var firebase = require("firebase/app");
var fs = require("firebase/firestore")

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDq94WizFNqYbBxz6j-zAHTlrz8AoCJfx0",
  authDomain: "coderslobby-84734.firebaseapp.com",
  projectId: "coderslobby-84734",
  storageBucket: "coderslobby-84734.appspot.com",
  messagingSenderId: "384546444769",
  appId: "1:384546444769:web:a18006d28151c4c0a26ea0",
  measurementId: "G-WY301S7YJM"
};

// Initialize Firebase
const fbApp = firebase.initializeApp(firebaseConfig);
const db = fs.getFirestore(fbApp);

fs.addDoc(fs.collection(db, "users"), {
    name: "Naimur",
    age: "52",
  });