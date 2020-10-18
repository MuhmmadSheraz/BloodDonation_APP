import { createStore } from "redux";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer";
// import AsyncStorage from "@react-native-community/async-storage";

// const persistConfig = {
//   key: "root",
//   storage:AsyncStorage,
// };
// const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(rootReducer);
// const persistor = persistStore(store);
export { store };
