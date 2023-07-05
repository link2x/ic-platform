// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDG7xdViZXfDd_-hm9ex3SywYqgL_zpt3M",
  authDomain: "ic-platform-a0a6e.firebaseapp.com",
  projectId: "ic-platform-a0a6e",
  storageBucket: "ic-platform-a0a6e.appspot.com",
  messagingSenderId: "499639049703",
  appId: "1:499639049703:web:7cd0c1e1cfa9a97cba7142"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export {app, db, auth}