import { combineReducers } from "redux";
import genericReducer from "./genericReducers";
import noteReducer from "./noteReducer";
import userReducer from "./userReducer";

const allReducers = combineReducers({
  Generic: genericReducer,
  Notes: noteReducer,
  User: userReducer,
});

export default allReducers;
