import React, { useEffect, useState } from "react";
import * as Facebook from "expo-facebook";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Button,
} from "native-base";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  BackHandler,
  Alert,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { removeUser } from "../../Store/Action/authAction";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import { TouchableOpacity } from "react-native-gesture-handler";

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

  // const facebooklogout = () => {
  //   Facebook.logOutAsync();
  //   props.loggedOut();
  //   console.log("logout fun");
  //   props.navigation.navigate("Login");
  // };
  return (
    <View style={Styles.homeWrapper}>
      <Header
        androidStatusBarColor="black"
        style={{ backgroundColor: "#D84146" }}
      >
        <Left>
          <Button transparent onPress={() => props.navigation.openDrawer()}>
            <Icon name="menu" size={30} color={"white"} />
          </Button>
        </Left>
        <Body></Body>
      </Header>
      <View style={Styles.header}>
        <Icon name="blood-bag" color={"white"} size={70} />
        {props.userData && props.userData?.user?.userName && (
          <Text style={{ color: "white", fontSize: 22, paddingVertical: 15 }}>
            Welcome{" "}
            <Text style={{ fontWeight: "bold" }}>
              {props.userData.user.userName}
            </Text>
          </Text>
        )}
        <Text style={{ color: "white", fontSize: 22, paddingVertical: 15 }}>
          Blood Donation App
        </Text>
        <Text style={{ color: "white", fontSize: 20 }}>
          Every Blood Donor Is Life Saver
        </Text>
      </View>
      <View style={Styles.subHeader}>
        <TouchableOpacity
          style={Styles.content}
          onPress={() => {
            props.navigation.navigate("Profile");
          }}
        >
          <Icon name="human-child" color={"#A60105"} size={70} />
          <Text style={{ alignItems: "center", fontSize: 28 }}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={Styles.content}
          onPress={() => {
            props.navigation.navigate("Donors");
          }}
        >
          {/* <Button title="Logout" onPress={facebooklogout} /> */}
          <Icon name="human-greeting" color={"#A60105"} size={70} />
          <Text style={{ alignItems: "center", fontSize: 28 }}>Donors</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginVertical: 20 }}></View>
    </View>
  );
};
const Styles = StyleSheet.create({
  homeWrapper: {
    flex: 1,
    // textAlign: "center",
    // justifyContent: "center",
  },
  header: {
    backgroundColor: "#D84146",
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
  },
  subHeader: {
    // flex:1,
    height: "100%",
    width: "100%",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  content: {
    // height:"30%",
    paddingTop: 30,
    borderLeftWidth: 1,
    borderColor: "gray",
    width: "50%",
    alignItems: "center",
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
