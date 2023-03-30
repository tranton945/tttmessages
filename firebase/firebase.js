import {initializeApp} from 'firebase/app'
import { 
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { 
  getDatabase, 
  ref, 
  onValue, 
  set,
  get,
  push,
  child,  
  onChildAdded,
  query,
  limitToLast,
  limitToFirst,
 } from 'firebase/database'
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAbfQin7r2ZRxYxIza7xObg_b6tyqYV6v4",
  authDomain: "tttmessages-df7f3.firebaseapp.com",
  databaseURL: "https://tttmessages-df7f3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tttmessages-df7f3",
  storageBucket: "tttmessages-df7f3.appspot.com",
  messagingSenderId: "977662063355",
  appId: "1:977662063355:android:2a8ddd4cc147df497f765e",
};

// const firebaseConfig = {
//   apiKey: "AIzaSyAhdeCpd7Ub9VXJk456-qzjmYMYQKtIIWQ",
//   authDomain: "tttmessages-df7f3.firebaseapp.com",
//   databaseURL: "https://tttmessages-df7f3-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "tttmessages-df7f3",
//   storageBucket: "tttmessages-df7f3.appspot.com",
//   messagingSenderId: "977662063355",
//   appId: "1:977662063355:web:ae96ef8bcf6be9c67f765e",
//   measurementId: "G-V99901FCNH"
// };

export const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const firebaseAut = getAuth();
const firebaseDatabase = getDatabase();
const firebaseRef = ref;
const firebaseSet = set;
const firebaseGet = get;
const firebaseChild = child;
const firebaseOnValue = onValue;
const firebasePush = push;
const firebaseOnChildAdded = onChildAdded;
const firebaseQuery = query;
// const firebaseLimitToLast  = limitToLast ;

export {
    firebaseAut,
    firebaseDatabase,
    firebaseRef,
    firebaseSet,
    firebaseGet,
    firebaseChild,
    firebaseOnValue,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    signInWithEmailAndPassword,
    firebasePush,
    storage,
    firebaseOnChildAdded,
    firebaseQuery,
    limitToLast,
    limitToFirst
}
