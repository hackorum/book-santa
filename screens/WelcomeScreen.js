import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import db from "../config";
import * as firebase from "firebase";

export default class WelcomeScreen extends Component {
  state = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    contact: "",
    age: "",
    confirmPassword: "",
    isModalVisible: false,
  };
  userLogin = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.navigation.navigate("DonateBooks");
      })
      .catch(function (error) {
        Alert.alert("Error" + error.message);
        console.log(error);
      });
  };
  userSignup = (email, password, confirmPassword) => {
    if (password != confirmPassword) {
      return Alert.alert("Passwords Do Not Match");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          db.collection("users").add({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            contact: this.state.contact,
            address: this.state.address,
            email: this.state.email.toLowerCase(),
            age: this.state.age,
            password: this.state.password,
            isBookRequestActive: false,
          });
          return Alert.alert("User Has Been Added", "", [
            {
              text: "OK",
              onPress: () => this.setState({ isModalVisible: false }),
            },
          ]);
        })
        .catch(function (error) {
          Alert.alert("Error" + error.message);
        });
    }
  };
  showModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent
        visible={this.state.isModalVisible}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={{ width: "100%" }}>
            <Text style={styles.modalTitle}>Registration</Text>
            <TextInput
              style={styles.formTextInput}
              placeholder="First Name"
              onChangeText={(text) => this.setState({ firstName: text })}
              maxLength={8}
              value={this.state.firstName}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder="Last Name"
              onChangeText={(text) => this.setState({ lastName: text })}
              maxLength={8}
              value={this.state.lastName}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder="Contact"
              keyboardType="numeric"
              onChangeText={(text) => this.setState({ contact: text })}
              maxLength={10}
              value={this.state.contact}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder="Address"
              onChangeText={(text) => this.setState({ address: text })}
              multiline
              value={this.state.address}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder="E-Mail"
              onChangeText={(text) => this.setState({ email: text })}
              keyboardType="email-address"
              value={this.state.email}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder="Password"
              onChangeText={(text) => this.setState({ password: text })}
              secureTextEntry
              value={this.state.password}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder="Confirm Password"
              onChangeText={(text) => this.setState({ confirmPassword: text })}
              secureTextEntry
              value={this.state.confirmPassword}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder="Age"
              onChangeText={(text) => this.setState({ age: text })}
              maxLength={3}
              value={this.state.age}
            />
            <View style={{ alignSelf: "center" }}>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() =>
                  this.userSignup(
                    this.state.email,
                    this.state.password,
                    this.state.confirmPassword
                  )
                }
              >
                <Text style={styles.registerButtonText}>Register</Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignSelf: "center" }}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => this.setState({ isModalVisible: false })}
              >
                <Text style={styles.registerButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        {this.showModal()}
        <Image source={require("../assets/santa.gif")} style={styles.gif} />
        <TextInput
          style={styles.loginBox}
          placeholder="abc@example.com"
          keyboardType="email-address"
          onChangeText={(text) => this.setState({ email: text })}
          value={this.state.email}
        />
        <TextInput
          style={styles.loginBox}
          placeholder="Enter your password here..."
          secureTextEntry
          onChangeText={(text) => this.setState({ password: text })}
          value={this.state.password}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.userLogin(this.state.email, this.state.password)}
        >
          <Text>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.setState({ isModalVisible: true })}
        >
          <Text>Sign Up</Text>
        </TouchableOpacity>
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
  gif: {
    width: 200,
    height: 200,
  },
  loginBox: {
    width: 300,
    height: 40,
    borderBottomWidth: 1.5,
    borderColor: "#ff8a65",
    fontSize: 20,
    margin: 10,
    paddingLeft: 10,
  },
  button: {
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#ff9800",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10.32,
    elevation: 16,
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffff",
    marginRight: 30,
    marginLeft: 30,
    marginTop: 80,
    marginBottom: 80,
  },
  modalTitle: {
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 30,
    color: "#ff5722",
    margin: 50,
  },
  formTextInput: {
    width: "75%",
    height: 45,
    alignSelf: "center",
    borderColor: "#ffab91",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  registerButton: {
    width: 200,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 30,
  },
  registerButtonText: { color: "#ff5722", fontSize: 15, fontWeight: "bold" },
  cancelButton: {
    width: 200,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
});
