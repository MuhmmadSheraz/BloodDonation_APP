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
  TouchableOpacity,
  BackHandler,
  SafeAreaView, ScrollView 
} from "react-native";

const Chat = (props) => {
  const [allChat, setAllChat] = useState([]);
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
                let obj = e.data();
                obj.id = item.id; //Final Object
                array.push(obj); //Push Into Array
              })
              .then(() => {
                setTimeout(() => {
                  console.log(array)
                  setAllChat(array);
                }, 1000);
              });
            // });
          } else if (item.data().recieverId === userId) {
            getUser(item.data().senderId)
              .then((e) => {
                let obj = e.data();
                obj.id = item.id; //Final Object
                array.push(obj); //Push Into Array
              })
              .then(() => {
                setTimeout(() => {
                  setAllChat(array);
                }, 1000);
              });
          }
        });
      });
  };
  const startChat = (id, recieverId, userName) => {
    props.navigation.navigate("ChatRoom", {
      chatId: id,
      name: userName,
      userId: props.user.user.userId,
      recieverId: recieverId,
    });
  };
  return (
    <View>
       <ScrollView style={Style.scrollView}>
      {allChat &&
        allChat.map((item) => {
          return (
            <TouchableOpacity
              onPress={() => startChat(item.id, item.userId, item.userName)}
              key={item.id}
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
                    <Text style={{ fontSize:18 }}>{item.userName}</Text>
                  
                  </View>
                </View>
                
              </View>
            </TouchableOpacity>
          );
        })}
        </ScrollView>
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
  scrollView: {
    marginHorizontal: 20,
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
