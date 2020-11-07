export default areaReducer = (state = [], action) => {
  switch (action.type) {
    case "Store_Areas": {
      console.log("state from Area Reducer", state);
      return { ...state, areas: action.data };
    }
    case "Remove_Areas": {
      return { ...state, areas: null };
    }
    default:
      return state;
  }
};
