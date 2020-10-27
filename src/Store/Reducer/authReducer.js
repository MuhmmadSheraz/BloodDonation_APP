export default authReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_USER_TO_STORE": {
      let updateUserObj = {
        userEmail: action.data.email,
        userName: action.data.name,
        userId: action.data.id,
        profilePicture: action.data.picture.data.url,
      };
      console.log("state from Auth Reducer", action,updateUserObj);
      return { ...state, user: updateUserObj };
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
