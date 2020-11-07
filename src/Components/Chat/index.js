import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import firebase from "firebase";
import { getUser } from "../../Config/firebase";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Image,
  TouchableOpacityBase,
  BackHandler
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import {
  createNativeWrapper,
  TouchableOpacity,
} from "react-native-gesture-handler";

const Chat = (props) => {
  const [allChat, setAllChat] = useState([]);
  const isFocused = useIsFocused();
  const backAction = () => {
    props.navigation.navigate("Home");
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    myChats(props.user.user.userId);
    return () => {
      backHandler.remove();
    };
  }, []);
  const myChats = async (userId) => {
    const array = [];
    firebase
      .firestore()
      .collection("Chat")
      .onSnapshot((doc) => {
        setAllChat([]); //empty State
        doc.forEach((item) => {
          if (item.data().senderId === userId) {
            getUser(item.data().recieverId)
              .then((e) => {
                console.log(item.id);
                let obj = e.data();
                obj.id = item.id; //Final Object
                array.push(obj); //Push Into Array
              })
              .then(() => {
                console.log("Aray Consoling===>", array);
                console.log("STATE Consoling===>", allChat);
                setTimeout(() => {
                  setAllChat(array);
                }, 1000);
              });
            // });
          } else if (item.data().recieverId === userId) {
            getUser(item.data().senderId)
              .then((e) => {
                console.log(item.id);
                let obj = e.data();
                obj.id = item.id; //Final Object
                array.push(obj); //Push Into Array
              })
              .then(() => {
                console.log("Aray Consoling===>", array);
                console.log("STATE Consoling===>", allChat);
                setTimeout(() => {
                  setAllChat(array);
                }, 1000);
              });
          }
        });
      });
  };
  const startChat = (id, recieverId, userName) => {
    console.log(id, recieverId);
    console.log(props);
    props.navigation.navigate("ChatRoom", {
      chatId: id,
      name: userName,
      userId: props.user.user.userId,
      recieverId: recieverId,
    });
  };
  return (
    <View>
      {allChat &&
        allChat.map((item) => {
          console.log(item);
          return (
            <TouchableOpacity
              onPress={() => startChat(item.id, item.userId, item.userName)}
            >
              <View style={Style.container}>
                <View style={Style.leftContainer}>
                  <Image
                    source={{
                      uri: item.profilePicture,
                    }}
                    style={Style.avatar}
                  />
                  <View style={Style.midContainer}>
                    <Text style={{ fontWeight: "bold" }}>{item.userName}</Text>
                    <Text>Kia Haal ha</Text>
                  </View>
                </View>
                <Text>Yesterday</Text>
              </View>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.authReducer,
  };
};

export default connect(mapStateToProps, null)(Chat);

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
    marginRight: 10,
  },
  midContainer: {
    justifyContent: "space-around",
  },
});
