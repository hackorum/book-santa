import React, { Component } from "react";
import { Text, StyleSheet, View, FlatList, ScrollView } from "react-native";
import { ListItem } from "react-native-elements";
import AppHeader from "../components/AppHeader";
import firebase from "firebase";
import db from "../config";

export default class MyReceivedBookScreen extends Component {
  constructor() {
    super();
    this.state = {
      uid: firebase.auth().currentUser.email,
      receivedBookList: [],
    };
  }
  getReceivedBookList = () => {
    this.requestRef = db
      .collection("received_books")
      .where("user_id", "==", this.state.uid)
      .where("book_status", "==", "received")
      .onSnapshot((snapshot) => {
        let list = [];
        snapshot.forEach((doc) => {
          let receivedBookList = doc.data();
          list.push(receivedBookList);
          this.setState({
            receivedBookList: list,
          });
        });
      });
  };
  renderItem = ({ item, i }) => {
    return (
      <ListItem key={i} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.book_name}</ListItem.Title>
          <ListItem.Subtitle>{item.book_status}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };
  keyExtractor = (item, index) => index.toString();
  componentDidMount() {
    this.getReceivedBookList();
  }
  componentWillUnmount() {
    this.getReceivedBookList();
  }
  render() {
    return (
      <View style={styles.container}>
        <AppHeader title="Received Books" navigation={this.props.navigation} />
        <View style={styles.container}>
          {this.state.receivedBookList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text>No Received Books</Text>
            </View>
          ) : (
            <FlatList
              data={this.state.receivedBookList}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
