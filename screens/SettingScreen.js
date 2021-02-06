import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AppHeader from "../components/AppHeader";
import db from "../config";
import firebase from "firebase";

export default class SettingScreen extends Component {
  state = {
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    contact: "",
    docId: "",
  };
  getUserDetails = async () => {
    const email = firebase.auth().currentUser.email;
    await db
      .collection("users")
      .where("email", "==", email)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          let data = doc.data();
          this.setState({
            email: email,
            firstName: data.firstName,
            lastName: data.lastName,
            contact: data.contact,
            address: data.address,
            docId: doc.id,
          });
        });
      });
  };
  updateUserDetails = () => {
    db.collection("users")
      .doc(this.state.docId)
      .update({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        contact: this.state.contact,
      })
      .then(() => {
        Alert.alert("Details Updated Successfully");
      });
  };
  componentDidMount() {
    this.getUserDetails();
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppHeader title="Settings" navigation={this.props.navigation} />
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.formTextInput}
              placeholder="First Name"
              onChangeText={(text) => this.setState({ firstName: text })}
              value={this.state.firstName}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder="Last Name"
              onChangeText={(text) => this.setState({ lastName: text })}
              value={this.state.lastName}
            />
            <TextInput
              style={styles.formTextInput}
              maxLength={10}
              keyboardType="numeric"
              placeholder="Contact"
              onChangeText={(text) => this.setState({ contact: text })}
              value={this.state.contact}
            />
            <TextInput
              style={[styles.formTextInput, { height: 90 }]}
              multiline
              placeholder="Address"
              onChangeText={(text) => this.setState({ address: text })}
              value={this.state.address}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={this.updateUserDetails}
            >
              <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>
          </View>
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
  formContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: "center",
    borderColor: "#ffab91",
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: "75%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: "#ff5722",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 22,
    color: "#fff",
  },
});
