import React from "react";

import { View, Text, StyleSheet, TextInput, Button, Image } from "react-native";

const Chat = () => {
  return (
    <View style={Style.container}>
      <View style={Style.leftContainer}>
        <Image
          source={{
            uri:
              "https://i0.wp.com/www.kahanihindi.com/wp-content/uploads/2020/02/Whatsapp-DP-images-1.jpg?resize=450%2C400&ssl=1",
          }}
          style={Style.avatar}
        />
      <View style={Style.midContainer}>
        <Text style={{fontWeight:"bold"}}>Khattak</Text>
        <Text>Kia Haal ha</Text>
      </View>
      </View>
      <Text>Yesterday</Text>
    </View>
  );
};

export default Chat;

const Style = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    padding: 10,
  },
  leftContainer: {
    flexDirection: "row",
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 50,
    marginRight:10
  },
  midContainer: {
    justifyContent: "space-around",
  },

});
