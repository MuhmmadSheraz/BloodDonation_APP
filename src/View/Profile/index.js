import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  BackHandler,
  ToastAndroid,
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
import { set } from "react-native-reanimated";

const Profile = (props) => {
  const [userData, setUserData] = useState();
  const [updateUserData, setUpdateUserData] = useState({});
  const [userName, setUserName] = useState(props.userInfo.user.userName);
  const [flag, setFlag] = useState(false);
  const [imageURL, setImageURL] = useState(
    props.userInfo.user.profilePicture
      ? props.userInfo.user.profilePicture
      : "https://icon-library.com/images/no-profile-pic-icon/no-profile-pic-icon-12.jpg"
  );
  const [userPhoneNumber, setUserPhoneNumber] = useState(
    props.userInfo.user.userPhoneNumber
  );
  const [bloodpicker, setBloodPicker] = useState(
    props.userInfo.user.bloodpicker
  );
  const [health, setHealth] = useState(props.userInfo.user.health);
  const [role, setRole] = useState(
    props.userInfo.user.role ? props.userInfo.user.role : ""
  );
  const [updateLocation, setUpdateLocation] = useState(
    props.userInfo.user.userLocation
  );
  const [picture, setPicture] = useState(props.userInfo.user.profilePicture);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    // getPic();
    console.log("Props Profile", props);
  }, []);
  const backAction = () => {
    props.navigation.navigate("Home");
  };

  const updateMyLocation = async () => {
    console.log("Location Function");
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
    }
    let location = await Location.getCurrentPositionAsync({});
    console.log("loction ====>", location);
    setUpdateLocation(location.coords);
  };
  useEffect(() => {
    console.log("Props User Location=====<", props.userInfo.user.userLocation);
    console.log("updateLocation============>", updateLocation);
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => {
      backHandler.remove();
    };
  }, [props]);

  const updateUserDetails = async () => {
    console.log(picture);
    console.log("Porps Image ===>", props.userInfo.user.profilePicture);
    console.log("Image Url", imageURL);
    if (
      updateLocation === "" ||
      updateLocation === undefined ||
      !updateLocation
    )
      return alert("Please Update Your Location");
    if (
      role === undefined ||
      userPhoneNumber === undefined ||
      health === undefined ||
      bloodpicker === undefined
    ) {
      console.log("Fields===>", role, userPhoneNumber, health, bloodpicker);
      return alert("Please Fill All The Fields");
    }

    console.log("pictureew------------------->", picture);
    console.log("props for get Download URL", props.userInfo.user.userId);

    if (flag || props.userInfo.user.profilePicture) {
      const ProfileURL = await getImageUrl(props.userInfo.user.userId);
      let updateUserObj = {
        userName,
        profilePicture:
          ProfileURL !== "" ? ProfileURL : props.userInfo.user.profilePicture,
        userPhoneNumber,
        health,
        bloodpicker,
        role,
        userLocation: updateLocation,
        userId: props.userInfo.user.userId,
      };
      setUpdateUserData(updateUserObj);

      updateUser(updateUserObj);
      props.updateUserAction(updateUserObj);

      ToastAndroid.show("Profile Updated !", ToastAndroid.SHORT);
      backAction();
    } else {
      let updateUserObj = {
        userName,
        profilePicture: "",
        userPhoneNumber,
        health,
        bloodpicker,
        role,
        userLocation: updateLocation,
        userId: props.userInfo.user.userId,
      };
      setUpdateUserData(updateUserObj);

      updateUser(updateUserObj);
      props.updateUserAction(updateUserObj);

      ToastAndroid.show("Profile Updated !", ToastAndroid.SHORT);
      backAction();
    }
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
    console.log(props, "[[[[[[[[[[[[[[[[]]]]]]]]]]]]");
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
    })
      .then((result) => {
        if (!result.cancelled) {
          //
          // User picked an image
          const { height, width, type, uri } = result;
          console.log("Image URIError=>", result);
          // setPicture(uri);
          return uriToBlob(uri);
        }
      })
      .then((blob) => {
        setFlag(true);
        return uploadToFirebase(blob, props);
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
            <Picker.Item label="Pick Your Blood Group" value="" />
            <Picker.Item label="All Blood Groups" value="" />
            <Picker.Item label="A+" value="A+" />
            <Picker.Item label="A-" value="A-" />
            <Picker.Item label="B-" value="B-" />
            <Picker.Item label="B+" value="B+" />
            <Picker.Item label="O-" value="O-" />
            <Picker.Item label="O+" value="O+" />
            <Picker.Item label="AB+" value="AB+" />
            <Picker.Item label="AB-" value="AB-" />
          </Picker>

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
            <Picker.Item label="Select Your Health Status" value="" />
            <Picker.Item label="Bad" value="Bad" />
            <Picker.Item label="Good" value="Good" />
            <Picker.Item label="Excellent" value="Excellent" />
          </Picker>
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
            <Picker.Item label="Select Your Role" value="" />
            <Picker.Item label="Reciever" value="Reciever" />
            <Picker.Item label="Donor" value="Donor" />
          </Picker>

          <Button
            info
            style={{ marginBottom: 4, borderRadius: 5 }}
            onPress={updateMyLocation}
            full
          >
            <Text style={{ color: "white" }}> Set Current Location </Text>
          </Button>
          <Button
            danger
            onPress={updateUserDetails}
            full
            style={{ borderRadius: 5 }}
          >
            <Text style={{ color: "white" }}> Update Profile </Text>
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
    fontSize: 20,
    marginBottom: 20,
    marginTop: 20,
    alignItems: "stretch",
    alignSelf: "stretch",
    textAlign: "left",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
});
const mapStateToProps = (state) => {
  console.log("state  profile===>", state.authReducer);
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
