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
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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
import Icon from "react-native-vector-icons/MaterialIcons";

const Login = (props) => {
  const [signUp, setSignUp] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setLoader(false);
    // console.log("Login Rendered");
    // if (props.user.user !== null) {
    //   props.navigation.navigate("Home");
    // console.log("props From Login useEffect", props.user.user);
    // }
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
        console.log(credential);
        firebase
          .auth()
          .signInWithCredential(credential)
          .catch((error) => {
            console.log("error", error);
          });
        const responseData = await fetch(
          `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture`
        );
        await responseData.json().then(async (data) => {
          setLoader(true);
          // console.log("responseData ==>", data);
          const check = await getUser(data.id);
          if (check.data() !== undefined) {
            console.log("If Working",data);
            // hello(check.data());
            props.signedInUser(check.data());
            // console.log("Check Data***", check.data());
          } else {
            console.log("Else Working", data);
            const userInfo = {
              userName: data.name,
              userId: data.id,
              userEmail: data?.email,
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
    } catch(er) {
      alert("FaceBook Login Failed");
console.log("eroor",er)      
    }
  };

  const clearStateSignIn = async () => {
    // console.log("Will Render Sign In");
    setPassword("");
    setEmail("");
    setSignUp(false);
  };
  const clearStateSignUp = () => {
    // console.log("Will Render Sign Up");
    setPassword("");
    setEmail("");
    setSignUp(true);
  };
  const signUpWithEmail = () => {
    if ((!email, !password, !userName))
      return Alert.alert("Please Fill All The Fields");
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 2000);
    // console.log("Sign Up With Email ", email, userName, password);
    sigUpWithFirebase(userName, email, password, setToReducer);
  };
  const setToReducer = (id) => {
    const data = {
      userName: userName,
      userEmail: email,
      userId: id,
    };
    // console.log(data);
    props.signedInUser(data);
    setLoader(true);
  };
  const signInWithEmail = async () => {
    if ((!email, !password)) return Alert.alert("Please Fill All The Fields");
    const a = await sigInWithFirebase(email, password);
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 2000);
    await props.signedInUser(a.data());

    // console.log("response", a.data());
  };
  
  return (
    <View style={Styles.loginWrapper}>
      {!loader ? (
        <View>
          {signUp ? (
            <View>
              <View style={Styles.AppHeader}>
                <Image
                  style={Styles.stretch}
                  source={require("../../../assets/blooddrop.png")}
                />
                <Text style={Styles.loginHeader}>Sign Up</Text>
              </View>
              <View style={Styles.fieldHeader}>
                <Icon name="person" color={"black"} size={25} />
                <TextInput
                  style={Styles.textField}
                  placeholder="Enter UserName"
                  onChangeText={(text) => setUserName(text)}
                />
              </View>
              <View style={Styles.fieldHeader}>
                <Icon name="email" color={"#000"} size={25} />
                <TextInput
                  style={Styles.textField}
                  placeholder="Enter Your Email"
                  onChangeText={(text) => {
                    setEmail(text);
                  }}
                />
              </View>
              <View style={Styles.fieldHeader}>
                <Icon name="lock" color={"#000"} size={25} />
                <TextInput
                  style={Styles.textField}
                  placeholder="Enter Your Password"
                  onChangeText={(text) => setPassword(text)}
                  secureTextEntry={true}
                />
              </View>
              <View style={Styles.authBtns}>
                <TouchableOpacity onPress={signUpWithEmail}>
                  <Text style={Styles.authStyle}>Sign Up</Text>
                </TouchableOpacity>
                {/* <Button title="Sign Up" onPress={signUpWithEmail} /> */}
              </View>
              <TouchableOpacity onPress={faceBookLogin}>
                <Text style={Styles.fbStyles}>SignIn With Facebook</Text>
              </TouchableOpacity>

                <Text style={{ fontSize: 15, paddingTop: 20 }}>
                  Already Have An Account? <Text onPress={clearStateSignIn} style={{color:"#ffff"}} >
                    Sign In
                    </Text>
                </Text>
            </View>
          ) : (
            <View>
              <View style={Styles.AppHeader}>
                <Image
                  style={Styles.stretch}
                  source={require("../../../assets/blooddrop.png")}
                />
                <Text style={Styles.loginHeader}>Login</Text>
              </View>
              <View style={Styles.fieldHeader}>
                <Icon name="email" color={"#000"} size={25} />
                <TextInput
                  style={Styles.textField}
                  placeholder="Enter Your Email"
                  onChangeText={(text) => {
                    setEmail(text);
                  }}
                />
              </View>
              <View style={Styles.fieldHeader}>
                <Icon name="lock" color={"#000"} size={25} />
                <TextInput
                  style={Styles.textField}
                  placeholder="Enter Your Password"
                  onChangeText={(text) => {
                    setPassword(text);
                  }}
                  secureTextEntry={true}
                />
              </View>
              <View style={{ marginBottom: 10 }}>
                {/* <Button title="Sign In" onPress={signInWithEmail} /> */}
              </View>
              <TouchableOpacity onPress={signInWithEmail}>
                <Text style={Styles.authStyle}>Sign In </Text>
              </TouchableOpacity>

              <View style={Styles.authBtns}>
                <TouchableOpacity onPress={faceBookLogin}>
                  <Text style={Styles.fbStyles}>SignIn With Facebook</Text>
                </TouchableOpacity>
              </View>
              {/* <Button title="SignIn With Facebook" onPress={faceBookLogin} /> */}
              <TouchableOpacity>
                <Text
                  style={{ fontSize: 15, paddingTop: 20, textAlign: "center" }}
                >
                  Don't Have An Account?{" "}
                  <Text onPress={clearStateSignUp} style={{ color: "white" }}>
                    {" "}
                    Sign Up
                  </Text>
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
  // console.log("State Login Componenet***", state);
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
    backgroundColor: "#f05454",

    paddingLeft: 35,
    paddingRight: 35,
    alignSelf: "stretch",
    flex: 1,
    justifyContent: "center",
  },
  loginHeader: {
    color: "white",
    fontSize: 50,
    marginBottom: 20,
  },
  textName: {
    fontSize: 20,
  },
  textField: {
    flex: 1,
    // width: 50,
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
    // borderBottomColor: "black",

    fontSize: 19,
    paddingLeft: 10,

    backgroundColor: "transparent",
    color: "#000",
  },
  stretch: {
    width: 100,
    height: 100,
  },
  AppHeader: { display: "flex", textAlign: "center", alignItems: "center" },
  fieldName: {
    color: "#fff",
    fontSize: 20,
    paddingBottom: 10,
    paddingTop: 10,
  },
  fieldHeader: {
    borderRadius: 50,
    paddingLeft: 10,
    paddingVertical: 5,
    marginVertical: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  facebookButton: {
    fontSize: 22,
    color: "red",
    backgroundColor: "green",
  },
  authBtns: {
    marginVertical: 15,
  },
  authStyle: {
    color: "#fff",
    backgroundColor: "#f05454",
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    borderRadius: 50,
    textAlign: "center",
    fontSize: 20,
    marginVertical: 5,
  },
  fbStyles: {
    color: "#fff",
    backgroundColor: "#214252",
    // borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    borderRadius: 50,
    textAlign: "center",
    fontSize: 20,
  },
});
