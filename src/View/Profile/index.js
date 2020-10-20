import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Image } from "react-native";
import { Picker } from "@react-native-community/picker";
import { updateProfile } from "../../Store/Action/authAction";
import { connect } from "react-redux";
import { cos } from "react-native-reanimated";
const Profile = ({ userInfo, updateUser, navigation }) => {
  const [userData, setUserData] = useState();
  const [pic, setPic] = useState("");
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("Profile Component*******");
      setUserData(userInfo);
      const profilePic = userInfo.user.picture.data.url;
      setPic(profilePic);
      // The screen is focused
      // Call any action
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    // console.log("state p Profile", userData);
    console.log("authReducer from Profile", userInfo);
  }, []);

  // // //   console.log("Profile Info", props);
  // // let updteUserProfileObj=userData.bloodGroup="lol"
  // // console.log(updteUserProfileObj)
  return (
    <View style={Styles.profilWrapper}>
      <Text>This Is Profile Page</Text>
      {userData && (
        <View
          style={{
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Image
            style={Styles.tinyLogo}
            source={{
              uri: pic,
            }}
          />
          <Text style={{ fontSize: 20,marginTop:10 }}>{userData.user.name}</Text>
          <Text style={{ fontSize: 20,marginTop:10 }}>BloodGroup A+</Text>

          <Picker
            selectedValue={"Check"}
            placeholder="Select Yourt"
            style={{
              height: 50,
              width: 250,
              borderWidth: 5,
              borderColor: "black",
              backgroundColor: "red",
              margin: 20,
            }}
          >
            <Picker.Item
              style={{ width: 100 }}
              label="Your Blood Group"
              value=""
            />
            <Picker.Item label="Blood -A" value="Blood -A " />
            <Picker.Item label="Blood B" value="Blood B " />
            <Picker.Item label="Blood AB" value="Blood AB " />
            <Picker.Item label="Blood O" value="Blood O " />
          </Picker>
          <Button
            title="Update Profile"
            onPress={() => updateUser((userData.bloodGroup = "Lol"))}
          />
        </View>
      )}
    </View>
  );
};

const Styles = StyleSheet.create({
  profilWrapper: {
    flex: 1,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  tinyLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.authReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (data) => dispatch(updateProfile(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
