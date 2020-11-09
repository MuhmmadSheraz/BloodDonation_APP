import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  Image,
  Button,
  ScrollView,
  BackHandler,
} from "react-native";
import { connect } from "react-redux";
import { showAreas } from "../../Config/utils";
import { getAllDonors } from "../../Config/firebase";
import Loader from "../../Components/Loader";
import { useIsFocused } from "@react-navigation/native";
import { addAreas } from "../../Store/Action/areaAction";
import { Picker } from "@react-native-community/picker";

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
    <Button
      title="Detail"
      onPress={() =>
        Parentprops.navigation.navigate("DonorDetails", {
          DonorId: item.item.userId,
          userId: Parentprops.user.user.userId,
        })
      }
    />
  </View>
);

const Donors = (props) => {
  const [donors, setDonors] = useState([]);
  const [loader, setLoader] = useState(true);
  const [blood, setBlood] = useState("");
  const [area, setArea] = useState("");
  const [isFilteredBlood, setIsFilteredBlood] = useState(false);
  const [isFilteredArea, setIsFilteredArea] = useState(false);

  const isFocused = useIsFocused();
  const backAction = () => {
    props.navigation.navigate("Home");
  };
  useEffect(() => {
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
  }, [isFocused]);

  const getAreas = async () => {
    const data = await showAreas();
    props.addAreas(data);
  };

  const sortDonors = async () => {
    const donorsData = await getAllDonors();
    const array = [];
    donorsData &&
      donorsData.forEach((x) => {
        let axisObj = {
          userLatitude:
            props.user.user.userLocation &&
            props.user.user.userLocation.latitude,
          donorLatitude: x.data() && x.data().userLocation.latitude,
          userLongitude:
            props.user.user.userLocation &&
            props.user.user.userLocation.longitude,
          donorLogitude: x.data() && x.data().userLocation.longitude,
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

    const donorsData = await getAllUsers();
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
    const donorsData = await getAllUsers();
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
    const donorsData = await getAllUsers();
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
    const donorsData = await getAllUsers();
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
          <Text>Filter By Nearest Area</Text>

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
          <Text>Filter By Blood Group</Text>

          <Picker
            selectedValue={blood}
            onValueChange={(text) => getBloodInfo(text)}
          >
            <Picker.Item label="All Blood Groups" value="" />
            <Picker.Item label="A+" value="A+" />
            <Picker.Item label="A-" value="A-" />
            <Picker.Item label="B+" value="B-" />
            <Picker.Item label="B+" value="B-" />
            <Picker.Item label="B-" value="B+" />
            <Picker.Item label="O-" value="O-" />
            <Picker.Item label="O+" value="O+" />
            <Picker.Item label="AB+" value="AB+" />
            <Picker.Item label="AB-" value="AB-" />
          </Picker>
          <Button title="Filter Donors" onPress={filterNow} />
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
    borderColor: "gray",
    borderWidth: 1,
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
  },
  midContainer: {
    justifyContent: "space-around",
  },
});

const mapStateToProps = (state) => {
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
