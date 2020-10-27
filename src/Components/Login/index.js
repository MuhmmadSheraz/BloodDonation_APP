import React, { useState, useEffect } from "react";
import * as Facebook from "expo-facebook";
import firebase from "firebase";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import {} from "../../Store/Action/authAction";
import { connect } from "react-redux";
import { addUser } from "../../Store/Action/authAction";
import { hello } from "../../Config/firebase";

const Login = (props) => {
  useEffect(() => {
    console.log("Login Rendered")
    if (props.user.user !== null) {
      props.navigation.navigate("Home");
      console.log("props From Login useEffect", props.user.user);
    }
  }, [props.user]);

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
        permissions: ["public_profile", "email"],
      });
      // console.log(
      //   "All Params Destructred",
      //   type,
      //   token,
      //   expirationDate,
      //   permissions,
      //   declinedPermissions
      // );

      //Permission
      if (type === "success") {
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        // console.log(credential);
        firebase
          .auth()
          .signInWithCredential(credential)
          .catch((error) => {
            // console.log("error", error);
          });
        const responseData = await fetch(
          `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture`
        );
        await responseData.json().then((data) => {
          console.log("responseData ==>", data);
          hello(data);
          // setIsLoggedIn(true);
          props.signedInUser(data);
        });
        // setIsLoggedIn(true);
      } else {
        alert("Permission Cancelled");
      }
    } catch {
      alert("FaceBook Login Failed==>");
    }
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
  console.log("State Login Componenet***", state);
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
