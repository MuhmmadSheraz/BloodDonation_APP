import React, { useEffect, useState } from "react";
import { getUser } from "../../Config/firebase";
import { View, Text, Image, StyleSheet, Button } from "react-native";

const DonorDetails = (props) => {
  const [donorData, setDonorData] = useState([]);
  useEffect(() => {
    console.log("Donors Details ****", props);
    getDonorDetails();
  }, [props]);
  const getDonorDetails = async () => {
    console.log(props.route.params.userId);
    const info = await getUser(props.route.params.userId);
    console.log("info", info && info.data());
    setDonorData(info && info.data());
  };
  return (
    <View style={styles.container}>
      {donorData && (
        <View style={{ marginTop: 30 }}>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: donorData.profilePicture,
              }}
              style={styles.avatar}
            />
          </View>
          <View>
            <Text
              style={{ fontSize: 20, textAlign: "center", marginVertical: 10 }}
            >
              {donorData.userName}
            </Text>
            <Text
              style={{ fontSize: 20, textAlign: "center", marginVertical: 10 }}
            >
              {donorData.bloodpicker}
            </Text>
            <Text
              style={{ fontSize: 20, textAlign: "center", marginVertical: 10 }}
            >
              {donorData.userPhoneNumber}
            </Text>
            <View style={{ marginVertical: 10 }}>
              <Button title="Call Now" />
            </View>
            <View>
              <Button
                title="Chat Now"
                onPress={() => props.navigation.navigate("Chat")}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default DonorDetails;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent:"center",
    alignItems: "center",
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  imageWrapper: {
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
});
