import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/Config/Navigation";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "./src/Store/index";
import { Provider } from "react-redux";

export default App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <StackNavigator />
          <StatusBar />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 60,
    paddingRight: 60,
    justifyContent: "center",
    backgroundColor: "#00A896",
  },
});
