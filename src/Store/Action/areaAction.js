export const addAreas = (areas) => {
  console.log("Action Cal");
  return {
    type: "Store_Areas",
    data: areas,
  };
};
export const removeAreas = () => {
  return {
    type: "Remove_Areas",
    data: null,
  };
};
