const initalState = { user: null };
export default authReducer = (state = initalState, action) => {
  switch (action.type) {
    case "ADD_USER_TO_STORE": {
      console.log("action From Sign IN Reducer", action);

      console.log("state from Auth Reducer", action.data);
      return { ...state, user: action.data };
    }
    case "REMOVE_USER_FRPM_STORE": {
      console.log("state from Auth Reducer", action);
      return { ...state, user: null };
    }
    case "UPDATE_PROFILE": {
      console.log("action.data==>",action.data)
      return { ...state, user: action.data };
    }
    default:
      return state;
  }
};
