import React, { Component, useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  // Button,
  ScrollView,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import { Button } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { connect } from "react-redux";
import { showAreas } from "../../Config/utils";
import { getAllDonors } from "../../Config/firebase";
import Loader from "../../Components/Loader";
import { useIsFocused } from "@react-navigation/native";
import { addAreas } from "../../Store/Action/areaAction";
import { Picker } from "@react-native-community/picker";
import { cos } from "react-native-reanimated";

const Item = ({ Parentprops, item, user }) => (
  <View style={Styles.itemContainer}>
    <View style={Styles.leftContainer}>
      <Image
        source={{
          uri: item.item.profilePicture,
        }}
        style={Styles.avatar}
      />
      <View style={Styles.midContainer}>
        <Text style={{ fontWeight: "bold" }}>{item.item.userName}</Text>
      </View>
    </View>
    <TouchableOpacity
      style={{
        justifyContent: "center",
      }}
      onPress={() =>
        Parentprops.navigation.navigate("DonorDetails", {
          DonorId: item.item.userId,
          userId: Parentprops.user.user.userId,
        })
      }
    >
      <Text
        style={{
          color: "#2782BB",
          paddingRight: 10,
        }}
      >
        View
      </Text>
    </TouchableOpacity>
  </View>
);

const Donors = (props) => {
  const [donors, setDonors] = useState([]);
  const [loader, setLoader] = useState(true);
  const [blood, setBlood] = useState("");
  const [area, setArea] = useState("");
  const [isFilteredBlood, setIsFilteredBlood] = useState(false);
  const [isFilteredArea, setIsFilteredArea] = useState(false);

  // const  = useIsFocused();
  const backAction = () => {
    props.navigation.navigate("Home");
  };
  useEffect(() => {
    console.log(props.user.user);
    if (!props.user.user.userLocation) {
      alert("Please Update Your Location");
      return backAction();
    }
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    if (props.areas.length === 0) {
      getAreas();
    }
    sortDonors();
    return () => {
      backHandler.remove();
      setBlood("");
      setArea("");
      setIsFilteredArea(false);
      setIsFilteredBlood(false);
    };
  }, []);

  const getAreas = async () => {
    const data = await showAreas(
      props.user.user.userLocation.latitude,
      props.user.user.userLocation.longitude
    );
    props.addAreas(data);
  };

  const sortDonors = async () => {
    const donorsData = await getAllDonors();

    const array = [];
    donorsData &&
      donorsData.forEach((x) => {
        if (x.data().userName === props.user.user.userName) {
          console.log(x.data())
          // continue;
        }
        let axisObj = {
          userLatitude:
            props.user.user.userLocation &&
            props.user.user.userLocation.latitude,
          donorLatitude: x.data().userLocation.latitude,
          userLongitude:
            props.user.user.userLocation &&
            props.user.user.userLocation.longitude,
          donorLogitude: x.data().userLocation.longitude,
        };
        const response = checkDistance(axisObj);
        if (response < 10) {
          array.push(x.data());
        }
      });

    setDonors(array);
    setLoader(false);
  };

  const checkDistance = ({
    userLatitude,
    donorLatitude,
    userLongitude,
    donorLogitude,
  }) => {
    let R = 6371; // km
    let dLat = toRad(donorLatitude - userLatitude);
    let dLon = toRad(donorLogitude - userLongitude);
    let lat1 = toRad(userLatitude);
    let lat2 = toRad(donorLatitude);

    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d;
  };
  function toRad(Value) {
    return (Value * Math.PI) / 180;
  }
  const renderItem = (item) => <Item Parentprops={props} item={item} />;

  const filterByArea = async () => {
    const data = props.areas.areas.filter((x) => x.name === area);

    const donorsData = await getAllDonors();
    const array = [];
    donorsData &&
      donorsData.forEach((x) => {
        if (data.length === 0) {
          array.push(x.data());
        } else {
          let axisObj = {
            userLatitude: data[0].location.lat,
            donorLatitude: x.data() && x.data().userLocation.latitude,
            userLongitude: data[0].location.lng,
            donorLogitude: x.data() && x.data().userLocation.longitude,
          };

          const response = checkDistance(axisObj);
          if (response < 10) {
            array.push(x.data());
          }
        }
      });
    setDonors(array);
    setLoader(false);
  };
  const filterByBloodGroup = async () => {
    const donorsData = await getAllDonors();
    const array = [];
    donorsData &&
      donorsData.forEach((x) => {
        if (blood === x.data().bloodpicker) {
          array.push(x.data());
        } else if (blood === "") {
          array.push(x.data());
        }
      });
    //
    setDonors(array);
    setLoader(false);
  };

  const filterNow = () => {
    if (isFilteredBlood && !isFilteredArea) {
      filterByBloodGroup();
      // setIsFilteredBlood(false);
    } else if (isFilteredArea && !isFilteredBlood) {
      filterByArea();
      // setIsFilteredArea(false);
    } else if (isFilteredArea && isFilteredBlood) {
      // setIsFilteredBlood(false);
      // setIsFilteredArea(false);
      extremeFilter();
    } else if (!isFilteredArea && !isFilteredBlood) {
      allDonors();
    }
  };
  const allDonors = async () => {
    const donorsData = await getAllDonors();
    const array = [];
    donorsData &&
      donorsData.forEach((x) => {
        array.push(x.data());
      });
    setDonors(array);
    setLoader(false);
  };
  const extremeFilter = async () => {
    const data = props.areas.areas.filter((x) => x.name === area);
    const array = [];
    const donorsData = await getAllDonors();
    donorsData &&
      donorsData.forEach((x) => {
        if (data.length === 0) {
          array.push(x.data());
        } else {
          let axisObj = {
            userLatitude: data[0].location.lat,
            donorLatitude: x.data() && x.data().userLocation.latitude,
            userLongitude: data[0].location.lng,
            donorLogitude: x.data() && x.data().userLocation.longitude,
          };

          const response = checkDistance(axisObj);
          if (response < 10) {
            if (blood !== "" && x.data().bloodpicker === blood) {
              array.push(x.data());
            } else if (blood === "") {
              array.push(x.data());
            }
          }
        }
      });
    setDonors(array);
    setLoader(false);
  };
  const getBloodInfo = (text) => {
    // if (text === "") {
    //   return setIsFilteredBlood(false );
    // }

    setBlood(text);
    setIsFilteredBlood(true);
  };
  const getAreaInfo = (text) => {
    setArea(text);
    setIsFilteredArea(true);
  };
  return (
    <ScrollView>
      {!loader ? (
        <View>
          <Text style={{ fontSize: 18, padding: 10 }}>
            Filter By Nearest Area
          </Text>

          <Picker
            selectedValue={area}
            onValueChange={(text) => getAreaInfo(text)}
          >
            <Picker.Item key={"No ID"} label="All Areas" value="" />
            {props.areas.areas &&
              props.areas.areas.map((item) => {
                return (
                  <Picker.Item
                    key={item.id}
                    label={item.name}
                    value={item.name}
                  />
                );
              })}
          </Picker>
          <Text style={{ fontSize: 18, padding: 10 }}>
            Filter By Blood Group
          </Text>

          <Picker
            selectedValue={blood}
            onValueChange={(text) => getBloodInfo(text)}
          >
            <Picker.Item label="All Blood Groups" value="" />
            <Picker.Item label="A+" value="A+" />
            <Picker.Item label="A-" value="A-" />
            <Picker.Item label="B-" value="B-" />
            <Picker.Item label="B+" value="B+" />
            <Picker.Item label="O-" value="O-" />
            <Picker.Item label="O+" value="O+" />
            <Picker.Item label="AB+" value="AB+" />
            <Picker.Item label="AB-" value="AB-" />
          </Picker>
          <Button
            full
            warning
            onPress={filterNow}
            style={{ marginHorizontal: 10, borderRadius: 5 }}
          >
            <Icon name="filter" size={20} />
            <Text style={{ fontSize: 20 }}>Filter Donor</Text>
          </Button>
          <FlatList
            data={donors}
            renderItem={renderItem}
            keyExtractor={(item) => item.userId}
          />
        </View>
      ) : (
        <Loader />
      )}
    </ScrollView>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 5,
    marginHorizontal: 5,
  },

  itemContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    padding: 10,
    // borderColor: "gray",
    marginHorizontal: 5,
    // borderWidth: 1,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  leftContainer: {
    flexDirection: "row",
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 10,
    marginRight: 10,
    // borderBottom:1,
    borderWidth: 1,
  },
  midContainer: {
    justifyContent: "space-around",
  },
});

const mapStateToProps = (state) => {
  console.log(state.authReducer);
  return {
    user: state.authReducer,
    areas: state.areaReducer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addAreas: (area) => dispatch(addAreas(area)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Donors);
