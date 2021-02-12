import React, { Component } from "react";
import { SwipeListView } from "react-native-swipe-list-view";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { ListItem } from "react-native-elements";
import db from "../config";

export default class SwipableFlatlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allNotifications: this.props.allNotifications,
    };
  }
  onSwipeValueChange = (swipeData) => {
    let allNotifications = this.state.allNotifications;
    const { key, value } = swipeData;
    if (value < -Dimensions.get("window").width) {
      const newData = [...allNotifications];
      this.updateMarkedAsRead(allNotifications[key]);
      newData.splice(key, 1);
      this.setState({
        allNotifications: newData,
      });
    }
  };
  updateMarkedAsRead = (notification) => {
    db.collection("all_notifications").doc(notification.doc_id).update({
      notification_status: "read",
    });
  };
  renderItem = (data) => {
    return (
      <Animated.View>
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>Book Name: {data.item.book_name}</ListItem.Title>
            <ListItem.Subtitle>Message: {data.item.message}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      </Animated.View>
    );
  };
  renderHiddenItem = () => {
    return (
      <View style={styles.rowBack}>
        <View style={styles.backRightButton}>
          <Text style={styles.backText}>Mark As Read</Text>
        </View>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <SwipeListView
          disableRightSwipe
          data={this.state.allNotifications}
          renderItem={this.renderItem}
          renderHiddenItem={this.renderHiddenItem}
          rightOpenValue={-Dimensions.get("window").width}
          previewRowKey={"0"}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onSwipeValueChange={this.onSwipeValueChange}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#29b6f6",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backRightButton: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 100,
    backgroundColor: "#29b6f6",
    right: 0,
  },
  backText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    alignSelf: "flex-start",
  },
});
