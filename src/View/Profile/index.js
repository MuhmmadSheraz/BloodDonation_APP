import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  BackHandler,
} from "react-native";
import { Picker } from "@react-native-community/picker";
import { updateProfile } from "../../Store/Action/authAction";
import { connect } from "react-redux";
import {
  updateUser,
  uploadToFirebase,
  getImageUrl,
} from "../../Config/firebase";
import { Container, Header, Content, Button } from "native-base";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

const Profile = (props) => {
  const [userData, setUserData] = useState();
  const [updateUserData, setUpdateUserData] = useState({});
  const [userName, setUserName] = useState(props.userInfo.user.userName);
  const [image, setImage] = useState(props.userInfo.user.bloodpicker);
  const [imageURL, setImageURL] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState(
    props.userInfo.user.userPhoneNumber
  );
  const [bloodpicker, setBloodPicker] = useState("");
  const [health, setHealth] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    getPermissionAsync = async () => {
      if (Constants.platform.android) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    };
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);
  const backAction = () => {
    props.navigation.navigate("Home");
  };
  useEffect(() => {

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => {
      backHandler.remove();
    };
  }, [props]);

  const updateUserDetails = async () => {
    {
      const ProfileURL = await getImageUrl(props.userInfo.user.userId);
      let updateUserObj = {
        profilePicture:
          ProfileURL !== "" ? ProfileURL : props.userInfo.user.profilePicture,
        userName,
        userPhoneNumber,
        health,
        bloodpicker,
        role,
        userLocation: location.coords,
        userId: props.userInfo.user.userId,
      };
      setUpdateUserData(updateUserObj);

      // setTimeout(() => {
      updateUser(updateUserObj);
      props.updateUserAction(updateUserObj);
      // }, 1000);
    }
    backAction();
  };

  // Update Image*************************
  let uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onload = function () {
        // return the blob
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        // something went wrong
        reject(new Error("uriToBlob failed"));
      };

      // this helps us get a blob
      xhr.responseType = "blob";

      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  const profileImageUpadte = (props) => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
    })
      .then((result) => {
        if (!result.cancelled) {
          // User picked an image
          const { height, width, type, uri } = result;
          return uriToBlob(uri);
        }
      })
      .then((blob) => {
        return uploadToFirebase(blob, props.userId);
      })
      .then((snapshot) => {
      })
      .catch((error) => {
        throw error;
      });
  };

  const updateImage = () => {
    const userId = props.userInfo.user.userId;
    profileImageUpadte(userId);
  };

  // Update Image//////////////////////////////*************************
  return (
    <ScrollView>
      <View style={Styles.profilWrapper}>
        <View
          style={{
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <View style={Styles.bg}>
            <TouchableOpacity onPress={updateImage}>
              <Image
                style={Styles.tinyLogo}
                source={{
                  uri: props.userInfo.user.profilePicture
                    ? props.userInfo.user.profilePicture
                    : "https://slcp.lk/wp-content/uploads/2020/02/no-profile-photo.png",
                }}
              />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Enter Your Name"
            style={Styles.textField}
            value={userName}
            onChangeText={(text) => setUserName(text)}
          ></TextInput>
          <TextInput
            onChangeText={(text) => setUserPhoneNumber(text)}
            value={userPhoneNumber}
            placeholder="Enter Your Phone No."
            style={Styles.textField}
          ></TextInput>

          <Text>Your Blood Group</Text>
          <Picker
            style={{
              height: 50,
              width: 250,
              borderWidth: 5,
              borderColor: "black",
            }}
            selectedValue={bloodpicker}
            onValueChange={(itemValue, itemIndex) => setBloodPicker(itemValue)}
          >
            <Picker.Item label="A" value="A" />
            <Picker.Item label="B" value="B" />
            <Picker.Item label="C" value="C" />
          </Picker>

          <Text>Your Health Staus</Text>
          <Picker
            selectedValue={health}
            style={{
              height: 50,
              width: 250,
              borderWidth: 5,
              borderColor: "black",
            }}
            onValueChange={(itemValue, itemIndex) => setHealth(itemValue)}
          >
            <Picker.Item label="Bad" value="Bad" />
            <Picker.Item label="Good" value="Good" />
            <Picker.Item label="Excellent" value="Excellent" />
          </Picker>
          <Text>Your Role</Text>
          <Picker
            selectedValue={role}
            style={{
              height: 50,
              width: 250,
              borderWidth: 5,
              borderColor: "black",
            }}
            onValueChange={(itemValue, itemIndex) => setRole(itemValue)}
          >
            <Picker.Item label="Donor" value="Donor" />
            <Picker.Item label="Reciever" value="Reciever" />
          </Picker>
          <Button danger onPress={updateUserDetails} full>
            <Text> Update Profile </Text>
          </Button>

          {/* <Button style={Styles.updateButton}  onPress={updateUserDetails} title="Upate Profile" /> */}
        </View>
      </View>
    </ScrollView>
  );
};

const Styles = StyleSheet.create({
  profilWrapper: {
    flex: 1,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  updateButton: {
    height: 40,
    fontSize: 20,
    marginTop: 30,
  },
  tinyLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  textField: {
    // height: 40,
    fontSize: 20,
    marginBottom: 20,
    marginTop: 20,
    alignItems: "stretch",
    alignSelf: "stretch",
    textAlign: "left",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  // bg:{
  //   // marginVertical:"30",
  //   backgroundColor:"yellow",
  //   height:"30"
  // }
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.authReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateUserAction: (data) => dispatch(updateProfile(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
