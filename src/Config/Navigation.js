import React, { useEffect, useState } from "react";
import * as Facebook from "expo-facebook";
import firebase from "firebase";

import Home from "../View/Home";
import Donors from "../View/Donors";
import ChatRoom from "../View/ChatRoom";
import Profile from "../View/Profile";
import Login from "../Components/Login";
import { connect } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "../Components/DrawerContent";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function StackNavigator(props) {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // async function toggleAuthAsync() {
  //   const auth = await Facebook.getAuthenticationCredentialAsync();

  //   if (!auth) {
  //     console.log("We are Logged In", auth);
  //     setIsLoggedIn(true);
  //   } else {
  //     console.log("We are Logged Out", auth);
  //     // Log out
  //     setIsLoggedIn(false);
  //   }
  //   console.log("State From Navigation", isLoggedIn);
  // }
  // useEffect(() => {
  //   toggleAuthAsync();
  // }, [isLoggedIn]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Home"
        component={MainNavigator}
        screenOptions={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
function MainNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Donors" component={Donors} />
      <Drawer.Screen name="ChatRoom" component={ChatRoom} />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        screenOptions={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.authReducer,
  };
};
export default connect(mapStateToProps, null)(StackNavigator);
