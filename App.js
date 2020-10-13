import React, { useState, useEffect } from "react";
import * as Facebook from "expo-facebook";

import {
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
1;

export default App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  // const changeUser=(para)=>{
  //   return setUserInfo(para)
  // }
 

  // Logout Fucntion
  const logout = () => {
    Facebook.logOutAsync();
    console.log(userInfo);
    setIsLoggedIn(false);
  };
  // Login Fucntion
  const faceBookLogin = async () => {
    // console.log("All State is Here===>", this.state);
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
          });
      } else {
        alert("Permission Cancelled");
      }
    } catch {
      alert("FaceBook Login Failed==>");
    }
  };

  return (
    <View style={styles.container}>
      {isLoggedIn && userInfo ? (
        <View style={styles.home}>
          <Text style={styles.userName}>Welcome {userInfo.name}</Text>
          <Image
            style={{ width: 200, height: 200, borderRadius: 50 }}
            source={{ uri: userInfo.picture.data.url }}
          />
          <Text style={styles.loginBtn} onPress={logout}>
            Logout
          </Text>
        </View>
      ) : (
        <View style={styles.login}>
          <Text>Login Here</Text>
          <Text style={styles.loginBtn} onPress={faceBookLogin}>
            FaceBook Login
          </Text>
        </View>
      )}
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#618685",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    color: "red",
    fontSize: 27,
  },
  loginBtn: {
    textAlign: "center",
    borderRadius: 90,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10,
    fontSize: 18,
  },
  userName: {
    fontSize: 22,
  },
});
