const addUser = (userData) => {

  console.log("userData fro Auth Action==============>", userData);
  return {
    type: "ADD_USER_TO_STORE",
    data: userData,
  };
};
const removeUser = (userData) => {
  console.log("userData fro Auth Action", userData);
  return {
    type: "REMOVE_USER_FRPM_STORE",
    data: null,
  };
};
const updateProfile = (data) => {
  return {
    type: "UPDATE_PROFILE",
    data: data,
  };
};
export { addUser, removeUser, updateProfile };
