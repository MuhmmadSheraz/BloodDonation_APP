export default authReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_USER_TO_STORE": {
      console.log("state from Auth Reducer", action);
      return { ...state, user: action.data };
    }
    case "REMOVE_USER_FRPM_STORE": {
      console.log("state from Auth Reducer", action);
      return { ...state, user: null };
    }
    case "UPDATE_PROFILE": {
      console.log("UPDATE_PROFILE", action);
      return { ...state, user: action.data };
    }
    default:
      return state;
  }
};
