import actionTypes from "../actionTypes";

const INITIAL_STATE = {
  Loading: false,
  SigningIn: false,
  SigningUp: false,
  searchText: "",
  Errors: [],
};

const genericReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.SET_SEARCHTEXT:
      return {
        ...state,
        searchText: action.payload,
      };

    case actionTypes.START_SIGNINGUP:
      return {
        ...state,
        SigningUp: true,
      };
    case actionTypes.STOP_SIGNINGUP:
      return {
        ...state,
        SigningUp: false,
      };
    case actionTypes.START_SIGNINGIN:
      return {
        ...state,
        SigningIn: true,
      };
    case actionTypes.STOP_SIGNINGIN:
      return {
        ...state,
        SigningIn: false,
      };

    case actionTypes.START_LOADING:
      return {
        ...state,
        Loading: true,
      };
    case actionTypes.STOP_LOADING:
      return {
        ...state,
        Loading: false,
      };

    default:
      return state;
  }
};

export default genericReducer;
