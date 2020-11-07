import React from "react";
import { Image, View, StyleSheet } from "react-native";

const Loader = () => {
  return (
    <View style={[styles.container, styles.horizontal]}>
      <Image
        source={{
          uri:
            "https://i.pinimg.com/originals/45/12/4d/45124d126d0f0b6d8f5c4d635d466246.gif",
        }}
        style={{ height: 150, width: 150 }}
      />
    </View>
  );
};

export default Loader;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
