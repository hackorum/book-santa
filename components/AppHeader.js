import React, { Component } from "react";
import { Text, StyleSheet, View, Platform, StatusBar } from "react-native";
import { Header, Icon, Badge } from "react-native-elements";
import db from "../config";
import firebase from "firebase";

export default class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: firebase.auth().currentUser.email,
      value: "",
    };
  }
  getNumberOfUnreadNotifications = () => {
    db.collection("all_notifications")
      .where("targeted_user_id", "==", this.state.uid)
      .where("notification_status", "==", "unread")
      .onSnapshot((snapshot) => {
        let unreadNotifications = snapshot.docs.map((doc) => doc.data());
        this.setState({
          value: unreadNotifications.length,
        });
      });
  };
  bellIconWithBage = () => {
    return (
      <View>
        <Icon
          name="bell"
          type="font-awesome"
          color="#ffff00"
          onPress={() => this.props.navigation.navigate("NotificationScreen")}
        />
        <Badge value={this.state.value} containerStyle={styles.badge} />
      </View>
    );
  };
  componentDidMount() {
    this.getNumberOfUnreadNotifications();
  }
  render() {
    if (!this.props.removeBell) {
      return (
        <Header
          backgroundColor="#ff5722"
          leftComponent={
            <Icon
              name="bars"
              type="font-awesome"
              color="#fff"
              onPress={() => this.props.navigation.toggleDrawer()}
            />
          }
          centerComponent={{
            text: this.props.title,
            style: { color: "#fff", fontSize: 20, fontWeight: "bold" },
          }}
          rightComponent={<this.bellIconWithBage {...this.props} />}
        />
      );
    } else {
      return (
        <Header
          backgroundColor="#ff5722"
          leftComponent={
            <Icon
              name="bars"
              type="font-awesome"
              color="#fff"
              onPress={() => this.props.navigation.toggleDrawer()}
            />
          }
          centerComponent={{
            text: this.props.title,
            style: { color: "#fff", fontSize: 20, fontWeight: "bold" },
          }}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ff5722",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    color: "#fff",
    fontSize: 25,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
  },
});
