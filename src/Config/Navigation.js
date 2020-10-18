import React, { useEffect, useState } from "react";

import Home from "../View/Home";
import Profile from "../View/Profile";
import Login from "../Components/Login";
import { connect } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function StackNavigator({ type, data }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log(type, data);
  return (
    <Stack.Navigator>
      {/* {isLoggedIn ? ( */}
      <Stack.Screen
        name="Home"
        component={MainNavigator}
        screenOptions={{
          headerShown: false,
        }}
      />
      {/* ) : ( */}
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      {/* )} */}
    </Stack.Navigator>
  );
}
function MainNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
}
// export default connect(mapStateToProps, null)(StackNavigator,);
