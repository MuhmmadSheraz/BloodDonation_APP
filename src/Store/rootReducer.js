import { combineReducers } from "redux";
import authReducer from "./Reducer/authReducer";
import areaReducer from "./Reducer/areaReducer";
// import companyReducer from "./reducer/companyReducer.js";
export default combineReducers({
  authReducer,
  areaReducer,
});
