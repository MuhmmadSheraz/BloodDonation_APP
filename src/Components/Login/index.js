import React, { useState,useEffect } from "react";
import * as Facebook from "expo-facebook";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import {} from "../../Store/Action/authAction";
import { connect } from "react-redux";
import { addUser } from "../../Store/Action/authAction";
const Login = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    {
      isLoggedIn && props.navigation.navigate("Home");
    }
  }, [isLoggedIn]);
  const faceBookLogin = async () => {
    try {
      await Facebook.initializeAsync({
        appId: "2760011904269364",
      });
      const {
        type,
        token,
        expirationDate,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile"],
      });
      console.log(
        "All Params Destructred",
        type,
        token,
        expirationDate,
        permissions,
        declinedPermissions
      );

      //Permission
      if (type === "success") {
        const responseData = await fetch(
          `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("responseData ==>", data);
            setIsLoggedIn(true);
            setUserInfo(data);
            console.log("props Login ***", props);
            props.signedInUser(data);
          });
      } else {
        alert("Permission Cancelled");
      }
    } catch {
      alert("FaceBook Login Failed==>");
    }
    setIsLoggedIn(true)
  };

  return (
    <View style={Styles.loginWrapper}>
      <Text style={Styles.loginHeader}>Login</Text>
      <Text style={Styles.textName}>Email</Text>
      <TextInput style={Styles.textField} placeholder="Enter Your Email" />
      <Text style={Styles.textName}>Password</Text>
      <TextInput style={Styles.textField} placeholder="Enter Your Password" />
      <View style={{ marginBottom: 10 }}>
        <Button title="Sign In" />
      </View>
      <Button title="FaceBook Sign In" onPress={faceBookLogin} />
    </View>
  );
};
const mapStateToProps = (state) => {
  console.log("StateFormLogin Componenet***", state);
  return {
    user: state.authReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    signedInUser: (user) => dispatch(addUser(user)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
const Styles = StyleSheet.create({
  loginWrapper: {
    backgroundColor: "#00A896",
    paddingLeft: 60,
    paddingRight: 60,
    alignSelf: "stretch",
    flex: 1,
    justifyContent: "center",
  },
  loginHeader: {
    fontSize: 44,
    color: "white",
    marginBottom: 30,
    borderBottomColor: "white",
    borderBottomWidth: 2,
  },
  textName: {
    fontSize: 20,
  },
  textField: {
    height: 40,
    marginBottom: 30,
    alignItems: "stretch",
    alignSelf: "stretch",
    textAlign: "left",
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
});
