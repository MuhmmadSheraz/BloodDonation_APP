import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Image } from "react-native";
import { Picker } from "@react-native-community/picker";
import { updateProfile } from "../../Store/Action/authAction";
import { connect } from "react-redux";
import { cos } from "react-native-reanimated";
const Profile = (props) => {
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    setUserData(props.userInfo);
    console.log("state pf Profile", userData);
    console.log("authReducer from Profile", props);
  }, []);
  const profilePic = userData.user.picture.data.url;

  //   console.log("Profile Info", props);
  let updteUserProfileObj=userData.bloodGroup="lol"
  console.log(updteUserProfileObj)
  return (
   <View style={Styles.profilWrapper}>
      <Text>This Is Profile Page</Text>
      <Image
        style={Styles.tinyLogo}
        source={{
          uri: profilePic,
        }}
      />
      <Text>Name :{userData.user.name}</Text>
      <Text>BloodGroup :Not Available</Text>
      <Picker selectedValue={"Check"} style={{ height: 50, width: 100 }}>
        <Picker.Item label="Blood -A" value="Blood -A " />
        <Picker.Item label="Blood B" value="Blood B " />
        <Picker.Item label="Blood AB" value="Blood AB " />
        <Picker.Item label="Blood O" value="Blood O " />
      </Picker>
      <Button title="Update Profile" onPress={props.updateUser(userData.bloodGroup="Lol")} />
    </View>
  );
};
const Styles = StyleSheet.create({
  profilWrapper: {
    flex: 1,
    padding: 60,
    textAlign: "center",
    justifyContent: "center",
  },
  tinyLogo: {
    width: 100,
    height: 100,
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
