import React, { useEffect, useState } from "react";
import { getUser, joinChatRoom } from "../../Config/firebase";
import { View, Text, Image, StyleSheet, Linking } from "react-native";
import { Button } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

const DonorDetails = (props) => {
  const [donorData, setDonorData] = useState([]);
  useEffect(() => {
    console.log("Donors Details ****", props);
    getDonorDetails();
  }, [props]);
  const getDonorDetails = async () => {
    console.log(props.route.params.DonorId);
    const info = await getUser(props.route.params.DonorId);
    console.log("info", info && info.data());
    setDonorData(info && info.data());
  };
  const startChat = async () => {
    // console.log("IDS", props.route.params.DonorId, props.route.params.userId);
    const firebaseData = await joinChatRoom(
      props.route.params.userId,
      props.route.params.DonorId
    );
    console.log("ChatdI", firebaseData);
    props.navigation.navigate("ChatRoom", {
      chatId: firebaseData.hasOwnProperty("chatId")
        ? firebaseData.chatId
        : firebaseData.id,
      userId: props.route.params.userId,
      recieverId: props.route.params.DonorId,
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {donorData && (
          <View style={{ marginTop: 30 }}>
            <TouchableOpacity
              style={styles.imageWrapper}
              onPress={() => alert("image clicked")}
            >
              <Image
                source={{
                  uri: donorData.profilePicture,
                }}
                style={styles.avatar}
              />
            </TouchableOpacity>

            <View>
              <Text style={styles.donorInfo}>
                Name: <Text style={{fontWeight:"bold"}}>{donorData.userName}</Text>
              </Text>
              <Text style={styles.donorInfo}>
                Blood Group: <Text style={{fontWeight:"bold"}} >{donorData.bloodpicker}</Text>
              </Text>
              <Text style={styles.donorInfo}>
                Health Status: <Text style={{fontWeight:"bold"}}>{donorData.health}</Text>
              </Text>
              <Text style={styles.donorInfo}>
                Phone Number: <Text style={{fontWeight:"bold"}}>{donorData.userPhoneNumber}</Text>
              </Text>
              <View style={{ margin: 10 }}>
                <Button
                  block
                  info
                  onPress={() =>
                    Linking.openURL(`tel:${donorData.userPhoneNumber}`)
                  }
                >
                  <Icon name="call-made" color={"#fff"} size={20} />
                  <Text style={{ color: "white" }}> Call Now</Text>
                </Button>
                {/* <Button
                title="Call Now"
                onPress={() =>
                  Linking.openURL(`tel:${donorData.userPhoneNumber}`)
                } */}
                {/* /> */}
              </View>
              <View style={{ margin: 10 }}>
                {/* <Button title="Chat Now" onPress={startChat} /> */}
                <Button block success onPress={startChat}>
                  <Icon name="chat-outline" color={"#fff"} size={20} />
                  <Text style={{ color: "white" }}> Start Chat</Text>
                </Button>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default DonorDetails;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    width: 150,
    borderRadius: 80,
    marginRight: 10,
  },
  donorInfo: {
    padding: 10,
    paddingBottom: 18,
    fontSize: 20,
    borderBottomColor: "red",
    borderBottomWidth: 2,
    margin: 10,
  },
  imageWrapper: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
