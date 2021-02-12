import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Icon, Card, Header } from "react-native-elements";
import firebase from "firebase";
import db from "../config";

export default class ReceiverDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receiverName: "",
      receiverContact: "",
      receiverAddress: "",
      receiverDocId: "",
      receiverId: this.props.navigation.getParam("details").user_id,
      uid: firebase.auth().currentUser.email,
      requestId: this.props.navigation.getParam("details")["request_id"],
      bookName: this.props.navigation.getParam("details")["book_name"],
      reasonToRequest: this.props.navigation.getParam("details")[
        "reason_to_request"
      ],
      userName: "",
    };
  }
  getReceiverDetails = async () => {
    await db
      .collection("users")
      .where("email", "==", this.state.receiverId)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          let data = doc.data();
          this.setState({
            receiverName: data.firstName,
            receiverContact: data.contact,
            receiverAddress: data.address,
          });
        });
      });
    await db
      .collection("requested_books")
      .where("request_id", "==", this.state.requestId)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          this.setState({
            receiverDocId: doc.id,
          });
        });
      });
  };
  getUserDetails = async (uid) => {
    await db
      .collection("users")
      .where("email", "==", uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          this.setState({
            userName: doc.data().firstName + " " + doc.data().lastName,
          });
        });
      });
  };
  update = () => {
    db.collection("all_donations").add({
      book_name: this.state.bookName,
      request_id: this.state.requestId,
      requested_by: this.state.receiverName,
      donor_id: this.state.uid,
      request_status: "donor interested",
    });
  };
  addNotification = () => {
    let message =
      this.state.userName + " Has Shown Interest In Donating The Book";
    db.collection("all_notifications").add({
      targeted_user_id: this.state.receiverId,
      donor_id: this.state.uid,
      request_id: this.state.requestId,
      book_name: this.state.bookName,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      notification_status: "unread",
      message: message,
    });
  };
  componentDidMount() {
    this.getReceiverDetails();
    this.getUserDetails(this.state.uid);
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.2 }}>
          <Header
            leftComponent={
              <Icon
                name="arrow-left"
                type="feather"
                color="#fff"
                onPress={() => this.props.navigation.goBack()}
              />
            }
            centerComponent={{
              text: "Donate Books",
              style: { color: "#fff", fontSize: 20, fontWeight: "bold" },
            }}
            backgroundColor="#ff5722"
          />
        </View>
        <View style={{ flex: 0.3 }}>
          <Card>
            <Card.Title>Book Information</Card.Title>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Name : {this.state.bookName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Reason : {this.state.reasonToRequest}
              </Text>
            </Card>
          </Card>
        </View>
        <View style={{ flex: 0.3 }}>
          <Card>
            <Card.Title>Receiver Information</Card.Title>

            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Name: {this.state.receiverName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Contact: {this.state.receiverContact}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Address: {this.state.receiverAddress}
              </Text>
            </Card>
          </Card>
        </View>

        <View style={styles.buttonContainer}>
          {this.state.receiverId !== this.state.uid ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.update();
                this.addNotification();
                this.props.navigation.navigate("MyDonations");
              }}
            >
              <Text>I want to Donate</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "orange",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },
});
