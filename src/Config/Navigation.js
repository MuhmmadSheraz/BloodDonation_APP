import React, { useEffect, useState } from "react";

import Home from "../View/Home";
import Donors from "../View/Donors";
import ChatRoom from "../View/ChatRoom";
import Profile from "../View/Profile";
import Login from "../Components/Login";
import { connect } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContent } from "../Components/DrawerContent";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function StackNavigator({ type, data }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log(type, data);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={MainNavigator}
        screenOptions={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
function MainNavigator() {
  return (
    // <Drawer.Navigator>
    //   <Drawer.Screen name="Home" component={Home} />
    //   <Drawer.Screen name="Donors" component={Donors} />
    //   <Drawer.Screen name="ChatRoom" component={ChatRoom} />
    //   <Drawer.Screen name="Profile" component={Profile} />
    // </Drawer.Navigator>
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Donors" component={Donors} />
      <Drawer.Screen name="ChatRoom" component={ChatRoom} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
}
// export default connect(mapStateToProps, null)(StackNavigator,);
