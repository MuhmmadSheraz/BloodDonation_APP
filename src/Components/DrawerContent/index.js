import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native-gesture-handler";

export function DrawerContent(props) {
  const [userData, setUserData] = useState();
  const paperTheme = useTheme();
  useEffect(() => {
    console.log("Drawer USeEffecr****0", props);
    setUserData(props.userInfo.user);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          {/* User Information************ */}
          {props.userInfo.user && (
            <View style={styles.userInfoSection}>
              <View style={{ flexDirection: "row", marginTop: 15 }}>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate("Profile")}
                >
                  <Avatar.Image
                    source={{
                      uri: props.userInfo.user.profilePicture
                        ? props.userInfo.user.profilePicture
                        : "https://slcp.lk/wp-content/uploads/2020/02/no-profile-photo.png",
                    }}
                    size={50}
                  />
                </TouchableOpacity>
                <View style={{ marginLeft: 15, flexDirection: "column" }}>
                  <Title style={styles.title}>
                    {props.userInfo.user.userName}
                  </Title>
                  <Caption style={styles.caption}>@j_doe</Caption>
                </View>
              </View>
            </View>
          )}
          {/* Drawer Content*********** */}
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              label="Home"
              onPress={() => {
                props.navigation.navigate("Home");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="chat-outline" color={color} size={size} />
              )}
              label="Chat"
              onPress={() => {
                props.navigation.navigate("ChatRoom");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="charity" color={color} size={size} />
              )}
              label="Donors"
              onPress={() => {
                props.navigation.navigate("Donors");
              }}
            />
          </Drawer.Section>
        </View>
        <Drawer.Section style={styles.bottomDrawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="exit-to-app" color={color} size={size} />
            )}
            label="Sign Out"
            onPress={() => {
              signOut();
            }}
          />
        </Drawer.Section>
      </DrawerContentScrollView>
    </View>
  );
}
const mapStateToProps = (state) => {
  console.log("state from Drawer", state);
  return {
    userInfo: state.authReducer,
  };
};
export default connect(mapStateToProps, null)(DrawerContent);
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },

  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
});
