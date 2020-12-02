import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { firebase } from "../../Config//firebase";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ScrollView,
  BackHandler,
  KeyboardAvoidingView
} from "react-native";
import { Container, Header, Content, Picker, Form } from "native-base";

import { sendMessage } from "../../Config/firebase";

const ChatRoom = ({ navigation, route }) => {
  const [message, setMessage] = useState("");

  const [chat, setChat] = useState([]);
  const backAction = () => {
    navigation.navigate("Chat");
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    console.log("Chat App----->", route);
    renderChat(route.params.chatId);
    return () => {
      backHandler.remove();
    };
  }, [route]);

  const sendMessageToFirebase = async () => {
    if (message === "") {
      return false;
    }
    var date = new Date();
    var timestamp = date.getTime();

    await sendMessage(
      route.params.chatId,
      route.params.userId,
      message,
      timestamp
    );
    setMessage("");
  };
  const renderChat = async (chatId) => {
    let chatArray = [];
    firebase
      .firestore()
      .collection("Chat")
      .doc(chatId)
      .collection("messages")
      .orderBy("time")
      .onSnapshot((doc) => {
        setChat([]);
        chatArray = [];
        doc.docs.forEach((x) => {
          let obj = x.data();
          obj.id = x.id;
          chatArray.push(obj);
        });
        setChat(chatArray);
      });
  };
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

  return (

    <View style={Style.container}>
      {/* <Text>Hello Chat</Text> */}
      <View style={Style.chat_Wrapper}>
      <ScrollView style={Style.scrollView}>
        {chat &&
          chat.map((x) => {
            // console.log("Chat ****",x)
            return (
              <Text
                key={x.id}
                style={{
                  // textAlign:
                  //   route.params.userId === x.userId ? "right" : "left",
                  alignSelf:
                    route.params.userId === x.userId
                      ? "flex-end"
                      : "flex-start",
                  backgroundColor:
                    route.params.userId === x.userId ? "#fb1f4e" : "#E7EAED",
                  color:
                    route.params.userId === x.userId ? "#E7EAED" : "#4F6988",
                  margin: 10,
                  padding: 10,
                  borderRadius: 20,
                  fontSize: 16,
                }}
              >
                {x.message}
              </Text>
            );
          })}
      </ScrollView>
      </View>
      <View style={Style.wrapper}>
        <View style={Style.inputWrapper}>
          <TextInput
            value={message}
            placeholder="Type Something"
            style={Style.messageInput}
            onChangeText={(text) => setMessage(text)}
            required={true}
          />
          <View style={Style.buttonSend}>
            <Icon name="send" size={30} onPress={sendMessageToFirebase} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ChatRoom;

const Style = StyleSheet.create({
  container: {
    height:"100%",
    width: "100%",
    // flexDirection: "row",
    padding: 10,
    // alignItems: "flex-end",
  },
  inputWrapper: {
    width: "100%",
    // height: "100%",
    flexDirection: "row",
    padding: 10,
    borderRadius: 25,
    marginRight: 10,
    alignItems: "center",
  },
  buttonSend: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -35,
    flexDirection: "row",
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 50,
    marginRight: 10,
  },
  messageInput: {
    fontSize: 18,
    borderBottomColor: "black",
    borderWidth: 1,
    width: "100%",
    padding: 10,
    paddingLeft: 15,
    borderRadius: 50,
  },
  wrapper: {
    height:"30%",
    width: "100%",
    flexDirection: "column-reverse",
    position: "absolute",
    bottom: 0,
  },
  chat_Wrapper:{
    height:"85%"
  }
});
