import firebase from 'firebase';
import 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyCPT2qjIuM_sYgwOUywJVOP4pXT31zyA60",
  authDomain: "unisys-5a8db.firebaseapp.com",
  databaseURL: "https://unisys-5a8db.firebaseio.com",
  projectId: "unisys-5a8db",
  storageBucket: "unisys-5a8db.appspot.com",
  messagingSenderId: "730730756436",
  appId: "1:730730756436:web:0c1ac0bd867923de0bf0c1",
  measurementId: "G-P582ZVHQC1"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
export {
 auth,
 firebase
};
