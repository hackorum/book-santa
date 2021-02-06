import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Header, Icon, Bagde } from "react-native-elements";
import db from "../config";
import firebase from "firebase";

export default class AppHeader extends Component {
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
          rightComponent={
            <Icon
              name="bell"
              type="font-awesome"
              color="#ffff00"
              onPress={() =>
                this.props.navigation.navigate("NotificationScreen")
              }
            />
          }
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
});
