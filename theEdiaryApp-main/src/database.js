import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Initialize Firebase
let db;
let auth;

const app = initializeApp({
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID,
});
db = getFirestore(app);
auth = getAuth(app);

console.log("successfully connected to the database");

export { db, auth };
// const googleSignin = async (dispatch) => {
//   const auth = getAuth();
//   const provider = new GoogleAuthProvider();

//   signInWithPopup(auth, provider)
//     .then(async (result) => {
//       // This gives you a Google Access Token. You can use it to access the Google API.
//       const credential = GoogleAuthProvider.credentialFromResult(result);
//       const token = credential.accessToken;
//       // The signed-in user info.
//       const user = result.user;
//       // add userData to doc(`users.${user.uid}`)
//       console.log(user);
//       localStorage.setItem("userId", user.uid);
//       const data = {
//         userName: user.displayName,
//         userEmail: user.email,
//         id: user.uid,
//         userHandle: user.email.split("@")[0],
//         allNotes: [],
//       };
//       let docRef = await setDoc(doc(db, "users", user.uid), data);
//       redux_addUser(dispatch, data);

//       return user;
//     })
//     .catch((error) => {
//       // Handle Errors here.
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // The email of the user's account used.
//       const email = error.customData.email;
//       // The AuthCredential type that was used.
//       const credential = GoogleAuthProvider.credentialFromError(error);
//       // ...
//       console.log(errorCode);
//       console.log(errorMessage);
//       console.log(email);
//       console.log(credential);
//       return {};
//     });
// };

// const registerNewUser = (userData, dispatch) => {
//   const auth = getAuth();
//   createUserWithEmailAndPassword(
//     auth,
//     userData.userEmail,
//     userData.userPassword
//   )
//     .then((userCredential) => {
//       // Signed in
//       const user = userCredential.user;
//       console.log(user);
//       localStorage.setItem("userId", user.uid);
//       const data = {
//         userName: userData.userName,
//         userEmail: userData.userEmail,
//         id: user.uid,
//         userHandle: userData.userHandle,
//         allNotes: [],
//       };
//       let docRef = setDoc(doc(db, "users", user.uid), data);
//       redux_addUser(dispatch, data);
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // ..
//     });
// };

// const loginExistingUser = (userData, dispatch) => {
//   const auth = getAuth();
//   signInWithEmailAndPassword(auth, userData.userEmail, userData.userPassword)
//     .then((userCredential) => {
//       // Signed in
//       const user = userCredential.user;
//       // ...
//       console.log(user);
//       localStorage.setItem("userId", user.uid);
//       // for {user.uid} fetch data : userName, userHandle , allNotes[]
//       const data = {
//         userName: "to be fetched ...",
//         userEmail: userData.userEmail,
//         id: user.uid,
//         userHandle: "to be fetched ...",
//         allNotes: ["to be fetched..."],
//       };
//       redux_addUser(dispatch, data);
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//     });
// };

// const userLogoutAPI = async (dispatch) => {
//   const auth = getAuth();
//   signOut(auth)
//     .then((res) => {
//       removeUser_redux(dispatch);
//       return true;
//     })
//     .catch((err) => {
//       return false;
//     });
// };

// export {
//   db,
//   auth,
//   googleSignin,
//   registerNewUser,
//   loginExistingUser,
//   userLogoutAPI,
// };
