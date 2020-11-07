import React, { useEffect, useState } from "react";
import * as Facebook from "expo-facebook";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  BackHandler,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { removeUser } from "../../Store/Action/authAction";

const Home = (props) => {
  const backAction = () => {
    BackHandler.exitApp();
    return true;
  };
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Sabhr Bhai!", "Exit The App?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [useIsFocused]);

  const facebooklogout = () => {
    Facebook.logOutAsync();
    props.loggedOut();
    console.log("logout fun");
    props.navigation.navigate("Login");
  };
  return (
    <View style={Styles.homeWrapper}>
      <Text>This Is Home Page</Text>
      <Button title="Logout" onPress={facebooklogout} />

      <View style={{ marginVertical: 20 }}></View>
    </View>
  );
};
const Styles = StyleSheet.create({
  homeWrapper: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
  },
});
const mapDispatchToProps = (dispatch) => {
  return {
    loggedOut: () => dispatch(removeUser(null)),
  };
};
const mapStateToProps = (state) => {
  return {
    userData: state.authReducer,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
