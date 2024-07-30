import actionTypes from "../actionTypes";

const noteReducer = (state = [], action) => {
  let newNotesList = [];
  switch (action.type) {
    case actionTypes.ADD_NOTES:
      return [...state, ...action.payload];

    case actionTypes.ADD_ONENOTE:
      return [action.payload, ...state];

    case actionTypes.UPDATE_ONENOTE:
      newNotesList = [...state];
      newNotesList.forEach((note) => {
        if (note.id == action.payload.id) {
          note.noteText = action.payload.noteText
          note.isPublic = action.payload.isPublic
          note.updateDate = action.payload.updateDate          
        }
        
      });
      return [...newNotesList];

    case actionTypes.REMOVE_ONENOTE:
      newNotesList = state.filter((note) => {
        if (note.id == action.payload) return false;
        else return true;
      });
      return [...newNotesList];

    case actionTypes.REMOVE_PRIVATENOTES:
      newNotesList = state.filter((note) => {
        return note.isPublic;
      });
      return newNotesList;

    default:
      return state;
  }
};

export default noteReducer;
