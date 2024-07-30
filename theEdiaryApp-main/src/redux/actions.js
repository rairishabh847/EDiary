import actionTypes from "./actionTypes";

// Generic ------------------------
//#region
export const startSigningIn = (dispatch) => {
  dispatch({
    type: actionTypes.START_SIGNINGIN,
  });
};

export const stopSigningIn = (dispatch) => {
  dispatch({
    type: actionTypes.STOP_SIGNINGIN,
  });
};

export const startSigningUp = (dispatch) => {
  dispatch({
    type: actionTypes.START_SIGNINGUP,
  });
};

export const stopSigningUp = (dispatch) => {
  dispatch({
    type: actionTypes.STOP_SIGNINGUP,
  });
};

export const startLoading = (dispatch) => {
  dispatch({
    type: actionTypes.START_LOADING,
  });
};

export const stopLoading = (dispatch) => {
  dispatch({
    type: actionTypes.STOP_LOADING,
  });
};

export const setSearchText_redux = (dispatch, data) => {
  dispatch({
    type: actionTypes.SET_SEARCHTEXT,
    payload: data,
  });
};

//#endregion

// users --------------------------
//#region
export const redux_addUser = (dispatch, data) => {
  dispatch({
    type: actionTypes.ADD_USER,
    payload: data,
  });
};
export const redux_removeUser = (dispatch) => {
  dispatch({
    type: actionTypes.REMOVE_USER,
  });
};
//#endregion

// notes --------------------------
//#region
export const redux_addNotes = (dispatch, data) => {
  dispatch({
    type: actionTypes.ADD_NOTES,
    payload: data,
  });
};

// add note
export const redux_addOneNote = (dispatch, data) => {
  data.createDate = new Date().toUTCString();
  dispatch({
    type: actionTypes.ADD_ONENOTE,
    payload: data,
  });
};


export const redux_removeOneNote = (dispatch, id) => {
  dispatch({
    type: actionTypes.REMOVE_ONENOTE,
    payload: id,
  });
};

// update note
export const redux_updateOneNote = (dispatch, data) => {
  data.updateDate = new Date().toUTCString();
  dispatch({
    type: actionTypes.UPDATE_ONENOTE,
    payload: data,
  });
};

export const redux_removePrivateNotes = (dispatch) => {
  dispatch({
    type: actionTypes.REMOVE_PRIVATENOTES,
  });
};

//#endregion
