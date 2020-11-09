import React from "react";
import { Image, View, StyleSheet } from "react-native";

const Loader = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri:
            "https://i.pinimg.com/originals/45/12/4d/45124d126d0f0b6d8f5c4d635d466246.gif",
        }}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </View>
  );
};

export default Loader;
const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "#FDD7E4",
    alignSelf: "stretch",
    textAlign: "center",
  },
});
