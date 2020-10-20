import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { connect } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import { removeUser } from "../../Store/Action/authAction";

const Home = (props) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log("Home Component*******");
  }, [isFocused]);
  const [isUser, setIsUser] = useState(true);
    useEffect(() => {
      
    }, [isUser]);
  const logout = () => {
    console.log("logout fun");
    props.navigation.navigate("Login");
    props.loggedOut();
  };
  return (
    <View style={Styles.homeWrapper}>
      <Text>This Is Home Page</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};
const Styles = StyleSheet.create({
  homeWrapper: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
  },
});
const mapDispatchToProps = (dispatch) => {
  return {
    loggedOut: () => dispatch(removeUser(null)),
  };
};
const mapStateToProps = (state) => {
  console.log("HOme State", state);
  return {
    userData: state.authReducer,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
