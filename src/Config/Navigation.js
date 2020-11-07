import React, { useEffect, useState } from "react";
import * as Facebook from "expo-facebook";
import firebase from "firebase";

import Home from "../View/Home";
import Donors from "../View/Donors";
import ChatRoom from "../View/ChatRoom";
import Profile from "../View/Profile";
import Login from "../Components/Login";
import DonorDetail from "../Components/DonorDetail";
import Chat from "../Components/Chat";
import { connect } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "../Components/DrawerContent";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function StackNavigator(props) {
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
        options={{ title: "My home", headerLeft: null }}
      />
      <Stack.Screen
        name="DonorDetails"
        component={DonorDetail}
        options={{ title: "Donors Details" ,
        headerStyle: {
          backgroundColor: "#db2924",
        },
        headerTintColor: "#fff",}}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ title: "My Chats" ,
        headerStyle: {
          backgroundColor: "#db2924",
        },
        headerTintColor: "#fff",}}
      />
      <Stack.Screen
        name="Donors"
        component={Donors}
        options={{ title: "My Donors" ,
        headerStyle: {
          backgroundColor: "#db2924",
        },
        headerTintColor: "#fff",}}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={({ route }) => ({ title: route.params.name })}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Profile",
          headerStyle: {
            backgroundColor: "#db2924",
          },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
}
function MainNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={Home} />
      {/* <Drawer.Screen name="Donor" component={Donors} />
      <Drawer.Screen name="ChatRoom" component={Chat} />
      <Drawer.Screen name="userProfile" component={Profile} /> */}
    </Drawer.Navigator>
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.authReducer,
  };
};
export default connect(mapStateToProps, null)(StackNavigator);
