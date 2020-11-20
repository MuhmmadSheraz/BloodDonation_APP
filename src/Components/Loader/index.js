import React from "react";
import { Image, View, StyleSheet } from "react-native";

const Loader = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/loader.gif")}
        style={{
          flex: 1,
          resizeMode: "cover",
        }}
      />
    </View>
  );
};

export default Loader;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
  },
});
