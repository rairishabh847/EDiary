import actionTypes from "../actionTypes";

const userReducer = (state = null, action) => {
  switch (action.type) {
    case actionTypes.ADD_USER:
      return {
        ...action.payload,
      };

    case actionTypes.REMOVE_USER:
      return null;

    case actionTypes.ADD_TONOTESARRAY:
      return {
        ...state,
        links: [action.payload, ...state.links],
      };

    case actionTypes.REMOVE_FROMNOTESARRAY:
      let newNotesArray = state.notes;
      newNotesArray.splice(newNotesArray.indexOf(action.payload), 1);
      return {
        ...state,
        links: newNotesArray,
      };

    default:
      return state;
  }
};

export default userReducer;
