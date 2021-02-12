import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Card, Icon, ListItem } from "react-native-elements";
import firebase from "firebase";
import AppHeader from "../components/AppHeader";
import db from "../config";

export default class MyDonationScreen extends Component {
  constructor() {
    super();
    this.state = {
      allDonations: [],
      uid: firebase.auth().currentUser.email,
      bookName: "",
      donorName: "",
    };
    this.requestRef = null;
  }
  getDonorDetails = (donorId) => {
    db.collection("users")
      .where("email", "==", donorId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            donorName: doc.data().firstName + " " + doc.data().lastName,
          });
        });
      });
  };
  getAllDonations = () => {
    this.requestRef = db
      .collection("all_donations")
      .where("donor_id", "==", this.state.uid)
      .onSnapshot((snapshot) => {
        let allDonations = [];
        snapshot.docs.map((doc) => {
          let donation = doc.data();
          donation["doc_id"] = doc.id;
          allDonations.push(donation);
        });
        this.setState({
          allDonations: allDonations,
        });
      });
  };
  sendNotification = (bookDetails, requestStatus) => {
    let requestId = bookDetails.request_id;
    let donorId = bookDetails.donor_id;
    db.collection("all_notifications")
      .where("request_id", "==", requestId)
      .where("donor_id", "==", donorId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let message = "";
          if (requestStatus === "book sent") {
            message = this.state.donorName + " Sent You A Book";
          } else {
            message =
              this.state.donorName + " Has Shown Interest In Donating The Book";
          }
          db.collection("all_notifications").doc(doc.id).update({
            message: message,
            notification_status: "unread",
            date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };
  sendBook = (bookDetails) => {
    if (bookDetails.request_status === "book sent") {
      let requestStatus = "donor interested";
      db.collection("all_donations")
        .doc(bookDetails.doc_id)
        .update({
          request_status: requestStatus,
        })
        .then(() => {
          this.sendNotification(bookDetails, requestStatus);
        });
    } else {
      let requestStatus = "book sent";
      db.collection("all_donations")
        .doc(bookDetails.doc_id)
        .update({
          request_status: requestStatus,
        })
        .then(() => {
          this.sendNotification(bookDetails, requestStatus);
        });
    }
  };
  componentDidMount() {
    this.getAllDonations();
    this.getDonorDetails(this.state.uid);
  }
  componentWillUnmount() {
    this.requestRef();
  }
  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem key={i} bottomDivider>
        <ListItem.Content>
          <ListItem.Title style={{ color: "black", fontWeight: "bold" }}>
            {item.book_name}
          </ListItem.Title>
          <ListItem.Subtitle style={{ color: "green" }}>
            Requested by: {item.requested_by}
          </ListItem.Subtitle>
          <ListItem.Subtitle style={{ color: "green" }}>
            status: {item.request_status}
          </ListItem.Subtitle>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  item.request_status === "book sent" ? "green" : "#ff5722",
              },
            ]}
            onPress={() => this.sendBook(item)}
          >
            <Text style={{ color: "#fff" }}>
              {item.request_status === "book sent" ? "Book Sent" : "Send Book"}
            </Text>
          </TouchableOpacity>
        </ListItem.Content>
      </ListItem>
    );
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppHeader navigation={this.props.navigation} title="My Donations" />
        <View style={{ flex: 1 }}>
          {this.state.allDonations.length === 0 ? (
            <View style={styles.subtitle}>
              <Text style={{ fontSize: 20 }}>List of all book Donations</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allDonations}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 16,
  },
  subtitle: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
