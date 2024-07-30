import {
  api_addOneNote,
  api_getAllHisPrivateNotes,
  api_getAllPublicNotes,
  api_getAllUserHandles,
  api_getUserByUserId,
  api_googleSignin,
  api_loginExistingUser,
  api_registerNewUser,
  api_removeOneNote,
  api_updateOneNote,
  api_userLogout,
} from "./endPoints";
import {
  redux_addNotes,
  redux_addOneNote,
  redux_addUser,
  redux_removeOneNote,
  redux_removePrivateNotes,
  redux_removeUser,
  redux_updateOneNote,
} from "./redux/actions";

// recreation
export const helperFunction_googleSignin = async (dispatch) => {
  return new Promise((resolve, reject) => {
    api_googleSignin()
      .then((userData) => {
        localStorage.setItem("userId", userData.id);
        redux_addUser(dispatch, userData);
        if (userData.allNotes.length) {
          helperFunction_getAllHisPrivateNotes(dispatch, userData.id).then(
            () => {
              return resolve(userData.id);
            }
          );
        } else return resolve(userData.id);
      })
      .catch((errorData) => {
        console.log("error in googleSignin", errorData);
        reject(errorData);
      });
  });
};

export const helperFunction_registerNewUser = (dispatch, userData) => {
  return new Promise((resolve, reject) => {
    api_registerNewUser(userData)
      .then((data) => {
        redux_addUser(dispatch, data);
        localStorage.setItem("userId", data.id);
        resolve();
      })
      .catch((errorData) => {
        console.log(errorData);
        reject(errorData);
      });
  });
};

export const helperFunction_loginExistingUser = (dispatch, userData) => {
  return new Promise((resolve, reject) => {
    api_loginExistingUser(userData)
      .then((userId) => {
        api_getUserByUserId(userId).then((data) => {
          redux_addUser(dispatch, data);
          localStorage.setItem("userId", data.id);

          if (data.allNotes.length) {
            helperFunction_getAllHisPrivateNotes(data.id).then(() => {
              resolve(true);
            });
          } else resolve(true);
        });
      })
      .catch((errorData) => {
        console.log(errorData);
        reject(errorData);
      });
  });
};

// insted : directly fetch user with userHandle ,
// if exists return false
// else true
export const helperFunction_userHandleIsUnique = (userHandle) => {
  return new Promise((resolve, reject) => {
    api_getAllUserHandles()
      .then((data) => {
        if (!data.includes(userHandle)) {
          return resolve(true);
        }
        return resolve(false);
      })
      .catch((errorData) => reject(errorData));
  });
};

export const helperFunction_getUserByUserId = (dispatch, userId) => {
  return new Promise((resolve, reject) => {
    api_getUserByUserId(userId)
      .then((data) => {
        redux_addUser(dispatch, data);
        resolve(data);
      })
      .catch((errorData) => {
        console.log(errorData);
        reject(errorData);
      });
  });
};

export const helperFunction_userLogout = (dispatch) => {
  return new Promise((resolve, reject) => {
    api_userLogout()
      .then(() => {
        localStorage.removeItem("userId");
        redux_removeUser(dispatch);
        redux_removePrivateNotes(dispatch);
        resolve(true);
      })
      .catch((errorData) => {
        reject(errorData);
      });
  });
};

export const helperFunction_getAllPublicNotes = (dispatch) => {
  return new Promise((resolve, reject) => {
    api_getAllPublicNotes()
      .then((data) => {
        redux_addNotes(dispatch, data);
        resolve(data);
      })
      .catch((errorData) => {
        reject(errorData);
      });
  });
};

export const helperFunction_getAllHisPrivateNotes = (dispatch, userId) => {
  return new Promise((resolve, reject) => {
    api_getAllHisPrivateNotes(userId)
      .then((data) => {
        if (data.length) {
          redux_addNotes(dispatch, data);
          resolve(data);
        } else {
          console.log("No Private Notes found!");
          resolve([]);
        }
      })
      .catch((errorData) => {
        reject(errorData);
      });
  });
};

export const helperFunction_getNoteData = (allNotes, noteId) => {
  return new Promise((resolve, reject) => {
    let noteData = null;
    if (allNotes.length)
      allNotes.forEach((note, index) => {
        if (note.id == noteId) noteData = note;
      });
    return resolve(noteData);
  });
  // if(!noteData) =>
  // this note is either
  // 1. private (!isPublic)
  // or
  // 2. deleted
};

export const helperFunction_addOneNote = (dispatch, noteData) => {
  return new Promise((resolve, reject) => {
    api_addOneNote(noteData)
      .then((res) => {
        // if (noteData.isPublic)
        redux_addOneNote(dispatch, noteData);
        resolve(res);
      })
      .catch((errorData) => {
        reject(errorData);
      });
  });
};
export const helperFunction_updateOneNote = (dispatch, noteData) => {
  return new Promise((resolve, reject) => {
    api_updateOneNote(noteData)
      .then((res) => {
        redux_updateOneNote(dispatch, noteData);
        resolve(res);
      })
      .catch((errorData) => {
        reject(errorData);
      });
  });
};
export const helperFunction_removeOneNote = (dispatch, noteId, userId) => {
  return new Promise((resolve, reject) => {
    api_removeOneNote(noteId, userId)
      .then((res) => {
        redux_removeOneNote(dispatch, noteId);
        // also remove fron allNotes[]
        resolve(res);
      })
      .catch((errorData) => {
        reject(errorData);
      });
  });
};
