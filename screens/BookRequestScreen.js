import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import * as firebase from "firebase";
import db from "../config";
import AppHeader from "../components/AppHeader";

export default class BookRequestScreen extends React.Component {
  state = {
    bookName: "",
    reason: "",
    uid: firebase.auth().currentUser.email,
  };
  addRequest = (bookName, reason) => {
    console.log(firebase.auth().currentUser);
    let uid = this.state.uid;
    let randomRequestId = Math.random().toString(36).substring(7);

    db.collection("requested_books").add({
      user_id: uid,
      book_name: bookName,
      reason_to_request: reason,
      request_id: randomRequestId,
    });
    this.setState({
      bookName: "",
      reason: "",
    });
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppHeader title="Request A Book" navigation={this.props.navigation} />
        <KeyboardAvoidingView style={styles.keyBoardStyle}>
          <TextInput
            placeholder="Enter Book Name..."
            style={styles.formTextInput}
            onChangeText={(text) => {
              this.setState({
                bookName: text,
              });
            }}
            value={this.state.bookName}
          />
          <TextInput
            multiline
            style={[styles.formTextInput, { height: 300 }]}
            numberOfLines={8}
            placeholder="Reason To Request"
            onChangeText={(text) => {
              this.setState({
                reason: text,
              });
            }}
            value={this.state.reason}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.addRequest(this.state.bookName, this.state.reason);
            }}
          >
            <Text>Initiate Request</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formTextInput: {
    width: "75%",
    height: 40,
    alignSelf: "center",
    borderColor: "#ffab91",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: "75%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#ff5722",
    marginTop: 20,
  },
});
