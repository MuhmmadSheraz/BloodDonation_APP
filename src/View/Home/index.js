import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { connect } from "react-redux";
import { removeUser } from "../../Store/Action/authAction";

const Home = (props) => {
    useEffect(()=>{
        console.log("home*****",props)

    },[])
  const [isUser, setIsUser] = useState(true);
  //   useEffect(() => {
  //     console.log("useEffect from Home");
  //     if (!isUser) {
  //       props.navigation.navigate("Login");
  //       console.log("Mooved To Login");
  //     } else {
  //       props.navigation.navigate("Home");
  //       console.log("Mooved To Home");
  //     }
  //   }, [isUser]);
    const logout = () => {
      console.log("logout fun");
      props.navigation.navigate("Login")
      props.loggedOut();
    };
  return (
    <View style={Styles.homeWrapper}>
      <Text>This Is Home Page</Text>
      <Button
        title="Logout"
        onPress={logout }
      />
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
    console.log("HOme State",state)
  return {
    userData: state.authReducer
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
