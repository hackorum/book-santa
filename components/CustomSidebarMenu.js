import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { DrawerItems } from "react-navigation-drawer";
import firebase from "firebase";

export default class Sidebar extends Component {
  logOut = () => {
    firebase.auth().signOut();
    this.props.navigation.navigate("WelcomeScreen");
  };
  render() {
    return (
      <SafeAreaView
        style={{
          marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <DrawerItems {...this.props} />
        <TouchableOpacity style={styles.button} onPress={this.logOut}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginTop: 50,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    alignSelf: "center",
    fontSize: 25,
  },
});
