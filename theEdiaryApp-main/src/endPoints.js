import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, auth } from "./database";

export const api_googleSignin = () => {
  return new Promise((resolve, reject) => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        const user = result.user;

        api_getUserByUserId(user.uid)
          .then((data) => {
            // this is : login
            resolve(data);
          })
          .catch((errorData) => {
            if (errorData.error) {
              reject(errorData);
            } else {
              // this is : register

              const data = {
                userName: user.displayName,
                userEmail: user.email,
                id: user.uid,
                userHandle: user.email.split("@")[0],
                allNotes: [],
              };
              setDoc(doc(db, "users", user.uid), data).then(() => {
                return resolve(data);
              });
            }
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);

        const errorData = { errorCode, errorMessage, email, credential };
        reject(errorData);
      });
  });
};

export const api_registerNewUser = (userData) => {
  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(
      auth,
      userData.userEmail,
      userData.userPassword
    )
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const data = {
          userName: userData.userName,
          userEmail: userData.userEmail,
          id: user.uid,
          userHandle: userData.userHandle,
          allNotes: [],
        };
        await setDoc(doc(db, "users", user.uid), data);
        return resolve(data);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const errorData = { errorCode, errorMessage };
        return reject(errorData);
      });
  });
};

export const api_loginExistingUser = (userData) => {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, userData.userEmail, userData.userPassword)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        return resolve(user.uid);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const errorData = { errorCode, errorMessage };
        return reject(errorData);
      });
  });
};

// insted : directly fetch user with userHandle ,
// if exists return false
// else true
export const api_getAllUserHandles = () => {
  return new Promise((resolve, reject) => {
    getDocs(collection(db, "users"))
      .then((querySnapshot) => {
        let allUserHandles = [];
        querySnapshot.forEach((doc) => {
          allUserHandles.push(doc.data().userHandle);
        });
        return resolve(allUserHandles);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const errorData = { errorCode, errorMessage };
        return reject(errorData);
      });
  });
};

export const api_getUserByUserId = (userId) => {
  return new Promise(async (resolve, reject) => {
    getDoc(doc(db, "users", userId))
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          return resolve(docSnapshot.data());
        }
        return reject({ errorMessage: "Wrong userId" });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const errorData = { errorCode, errorMessage };
        return reject(errorData);
      });
  });
};

export const api_userLogout = () => {
  return new Promise((resolve, reject) => {
    signOut(auth)
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const errorData = { errorCode, errorMessage };
        return reject(errorData);
      });
  });
};

export const api_getAllPublicNotes = () => {
  return new Promise((resolve, reject) => {
    getDocs(query(collection(db, "notes"), where("isPublic", "==", true)))
      .then((querySnapshot) => {
        let listOfNameOfNotes = [];
        let allNotes = [];
        querySnapshot.forEach((doc) => {
          allNotes.push(doc.data());
          listOfNameOfNotes.push(doc.data().noteName);
        });
        // const data = { allNotes, listOfNameOfNotes };
        // return resolve(data);
        return resolve(allNotes);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const errorData = { errorCode, errorMessage };
        return reject(errorData);
      });
  });
};

export const api_getAllHisPrivateNotes = (userId) => {
  return new Promise((resolve, reject) => {
    getDocs(
      query(
        collection(db, "notes"),
        where("isPublic", "==", false),
        where("userId", "==", userId)
      )
    )
      .then((querySnapshot) => {
        let allNotes = [];
        querySnapshot.forEach((doc) => {
          allNotes.push(doc.data());
        });
        return resolve(allNotes);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const errorData = { errorCode, errorMessage };
        return reject(errorData);
      });
  });
};

export const api_getNoteByNoteId = (noteId, userId) => {
  return new Promise(async (resolve, reject) => {
    getDoc(doc(db, "notes", noteId))
      .then((docSnapshot) => {
        const noteData = docSnapshot.data();
        if (noteData) {
          if (noteData.isPublic) {
            return resolve(noteData);
          } else if (userId && noteData.userId == userId) {
            return resolve(noteData);
          }
        }
        return reject({
          errorMessage: "Wrong userId or this is a protected note",
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const errorData = { errorCode, errorMessage };
        return reject(errorData);
      });
  });
};

export const api_addOneNote = (noteData) => {
  return new Promise((resolve, reject) => {
    setDoc(doc(db, "notes", noteData.id), noteData)
      .then(() => {
        updateDoc(doc(db, "users", noteData.userId), {
          allNotes: arrayUnion(noteData.id),
        });
        resolve(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const errorData = { errorCode, errorMessage };
        return reject(errorData);
      });
  });
};

export const api_updateOneNote = (noteData) => {
  return new Promise((resolve, reject) => {
    updateDoc(doc(db, "notes", noteData.id), noteData)
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const errorData = { errorCode, errorMessage };
        return reject(errorData);
      });
  });
};

export const api_removeOneNote = (noteId, userId) => {
  return new Promise((resolve, reject) => {
    deleteDoc(doc(db, "notes", noteId))
      .then(() => {
        updateDoc(doc(db, "users", userId), {
          allNotes: arrayRemove(noteId),
        });
        resolve(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const errorData = { errorCode, errorMessage };
        return reject(errorData);
      });
  });
};

// export const moveData = () => {
//   let allNotes = [];
//   getDocs(collection(db, "notes"))
//     .then((querySnapshot) => {
//       querySnapshot.forEach(async (document) => {
//         let note = document.data();
//         allNotes.push(note);
//         await setDoc(doc(db, "oldNotes", note.id), note);
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };
