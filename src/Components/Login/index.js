import React, { useState, useEffect } from "react";
import * as Facebook from "expo-facebook";
import firebase from "firebase";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Image,
  TouchableOpacityBase,
  ActivityIndicator,
} from "react-native";
import Loader from "../../Components/Loader";
import {} from "../../Store/Action/authAction";
import { connect } from "react-redux";
import { addUser } from "../../Store/Action/authAction";
import {
  hello,
  sigUpWithFirebase,
  sigInWithFirebase,
  getUser,
} from "../../Config/firebase";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native-gesture-handler";

const Login = (props) => {
  const [signUp, setSignUp] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setLoader(false);
    console.log("Login Rendered");
    if (props.user.user !== null) {
      props.navigation.navigate("Home");
      console.log("props From Login useEffect", props.user.user);
    }
  }, [props.user.user]);
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
        await responseData.json().then(async (data) => {
          setLoader(true);
          console.log("responseData ==>", data);
          const check = await getUser(data.id);
          if (check.data() !== undefined) {
            console.log("If Working");
            // hello(check.data());
            props.signedInUser(check.data());
            console.log("Check Data***", check.data());
          } else {
            console.log("Else Working", data);
            const userInfo = {
              userName: data.name,
              userId: data.id,
              userEmail: data.email,
              profilePicture: data.picture.data.url,
            };
            hello(data);
            props.signedInUser(userInfo);
          }
        });

        // setIsLoggedIn(true);
      } else {
        alert("Permission Cancelled");
      }
    } catch {
      alert("FaceBook Login Failed==>");
    }
  };

  const clearStateSignIn = async () => {
    console.log("Will Render Sign In");
    setPassword("");
    setEmail("");
    setSignUp(false);
  };
  const clearStateSignUp = () => {
    console.log("Will Render Sign Up");
    setPassword("");
    setEmail("");
    setSignUp(true);
  };
  const signUpWithEmail = () => {
    console.log("Sign Up With Email ", email, userName, password);
    sigUpWithFirebase(userName, email, password, setToReducer);
              setLoader(true);

  };
  const setToReducer = (id) => {
    const data = {
      userName: userName,
      userEmail: email,
      userId: id,
    };
    console.log(data);
    props.signedInUser(data);
    setLoader(true);

  };
  const signInWithEmail = async () => {
    console.log("1111", email, userName, password);
    console.log("Sign In With Email ", email, userName, password);
    setLoader(true);
    const a = await sigInWithFirebase(email, password);
    await props.signedInUser(a.data());

    console.log("response", a.data());
  };

  return (
    <View style={Styles.loginWrapper}>
      {!loader ? (
        <View>
          <View style={Styles.AppHeader}>
            <Image
              style={Styles.stretch}
              source={require("../../../assets/blood-drop.png")}
            />
            <Text style={Styles.loginHeader}>Blood Donation</Text>
          </View>

          {signUp ? (
            <View>
              <View style={Styles.fieldHeader}>
                {/* <Icon name="user" color={"#D32F2F"} size={25} /> */}
                <TextInput
                  style={Styles.textField}
                  placeholder="Enter UserName"
                  onChangeText={(text) => setUserName(text)}
                />
              </View>
              <View style={Styles.fieldHeader}>
                <Icon name="home-outline" color={"#D32F2F"} size={25} />
                <TextInput
                  style={Styles.textField}
                  placeholder="Enter Your Email"
                  onChangeText={(text) => {
                    setEmail(text);
                  }}
                />
              </View>
              <View style={Styles.fieldHeader}>
                <Icon name="lock" color={"#D32F2F"} size={25} />
                <TextInput
                  style={Styles.textField}
                  placeholder="Enter Your Password"
                  onChangeText={(text) => setPassword(text)}
                />
              </View>
              <View style={{ marginBottom: 10 }}>
                <Button title="Sign Up" onPress={signUpWithEmail} />
              </View>
              <Button title="SignIn With Facebook" onPress={faceBookLogin} />

              <TouchableOpacity onPress={clearStateSignIn}>
                <Text style={{ fontSize: 15, paddingTop: 20 }}>
                  Already Have An Account? Sign In
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View style={Styles.fieldHeader}>
                <Icon name="home-outline" color={"#D32F2F"} size={25} />
                <TextInput
                  style={Styles.textField}
                  placeholder="Enter Your Email"
                  onChangeText={(text) => {
                    setEmail(text);
                  }}
                />
              </View>
              <View style={Styles.fieldHeader}>
                <Icon name="lock" color={"#D32F2F"} size={25} />
                <TextInput
                  style={Styles.textField}
                  placeholder="Enter Your Password"
                  onChangeText={(text) => {
                    setPassword(text);
                  }}
                />
              </View>
              <View style={{ marginBottom: 10 }}>
                <Button title="Sign In" onPress={signInWithEmail} />
              </View>

              <Button title="SignIn With Facebook" onPress={faceBookLogin} />
              <TouchableOpacity onPress={clearStateSignUp}>
                <Text style={{ fontSize: 15, paddingTop: 20 }}>
                  Don't Have An Account?Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <Loader />
      )}
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
    backgroundColor: "white",
    paddingLeft: 60,
    paddingRight: 60,
    alignSelf: "stretch",
    flex: 1,
    justifyContent: "center",
  },
  loginHeader: {
    fontSize: 34,
    color: "black",
    marginBottom: 30,
  },
  textName: {
    fontSize: 20,
  },
  textField: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
    height: 40,
    // marginBottom: 30,
    alignItems: "stretch",
    textAlign: "left",
    borderBottomColor: "black",
    borderBottomWidth: 2,
    fontSize: 19,
    paddingLeft: 10,
  },
  stretch: {
    width: 100,
    height: 100,
  },
  AppHeader: { display: "flex", textAlign: "center", alignItems: "center" },
  fieldName: {
    color: "#05375a",
    fontSize: 20,
    paddingBottom: 10,
    paddingTop: 10,
  },
  fieldHeader: {
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  facebookButton: {
    fontSize: 22,
    color: "red",
    backgroundColor: "green",
  },
});
