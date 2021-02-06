import React, { Component } from "react";
import { Text, StyleSheet, SafeAreaView, Platform, StatusBar } from "react-native";

export default class AppHeader extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.titleText}>{this.props.title}</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ff5722',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    color: '#fff',
    fontSize: 25
  }
});
