import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  TouchableHighlight,
  FlatList,
} from "react-native";
import * as firebase from "firebase";
import db from "../config";
import AppHeader from "../components/AppHeader";
import { BookSearch } from "react-native-google-books";

export default class BookRequestScreen extends React.Component {
  state = {
    bookName: "",
    reason: "",
    uid: firebase.auth().currentUser.email,
    isBookRequestActive: null,
    requestedBookName: "",
    bookStatus: "",
    requestId: "",
    userDocId: "",
    docId: "",
    imageLink: "",
    dataSource: "",
    showFlatlist: false,
  };
  getBookRequest = () => {
    let bookRequest = db
      .collection("requested_books")
      .where("user_id", "==", this.state.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          let data = doc.data();
          if (data.book_status !== "received") {
            this.setState({
              requestId: data.request_id,
              requestedBookName: data.book_name,
              bookStatus: data.book_status,
              docId: doc.id,
            });
          }
        });
      });
  };
  receivedBooks = (bookName) => {
    let { uid, requestId } = this.state;
    db.collection("received_books").add({
      user_id: uid,
      book_name: bookName,
      request_id: requestId,
      book_status: "received",
    });
  };
  sendNotification = () => {
    db.collection("users")
      .where("email", "==", this.state.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          let data = doc.data();
          let firstName = data.first_name;
          let lastName = data.last_name;
          db.collection("all_notifications")
            .where("request_id", "==", this.state.requestId)
            .get()
            .then((response) => {
              response.forEach((doc) => {
                let data = doc.data();
                let donorId = data.donor_id;
                let bookName = data.book_name;
                db.collection("all_notifications").add({
                  targeted_user_id: donorId,
                  message:
                    firstName +
                    " " +
                    lastName +
                    " Received The Book " +
                    bookName,
                  notification_status: "unread",
                  book_name: bookName,
                });
              });
            });
        });
      });
  };
  getIsBookRequestActive() {
    db.collection("users")
      .where("email", "==", this.state.uid)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            isBookRequestActive: doc.data().isBookRequestActive,
            userDocId: doc.id,
          });
        });
      });
  }
  addRequest = async (bookName, reason) => {
    let uid = this.state.uid;
    let randomRequestId = Math.random().toString(36).substring(7);
    let books = await BookSearch.searchbook(
      bookName,
      "AIzaSyC0IuLGYN3dgxC0fByTu0nCiqjVFragT-Y"
    );
    db.collection("requested_books").add({
      user_id: uid,
      book_name: bookName,
      reason_to_request: reason,
      request_id: randomRequestId,
      book_status: "requested",
      date: firebase.firestore.FieldValue.serverTimestamp(),
      image_link: books.data[0].volumeInfo.imageLinks.smallThumbnail,
    });
    this.getBookRequest();
    db.collection("users")
      .where("email", "==", uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            isBookRequestActive: true,
          });
        });
      });
    this.setState({
      bookName: "",
      reason: "",
      requestId: randomRequestId,
    });
    Alert.alert("Book Requested Successfully");
  };
  updateBookRequestStatus = () => {
    db.collection("requested_books").doc(this.state.docId).update({
      book_status: "received",
    });
    db.collection("users")
      .where("email", "==", this.state.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            isBookRequestActive: false,
          });
        });
      });
  };
  async getBooksFromAPI(bookName) {
    this.setState({
      bookName: bookName,
    });
    if (bookName.length > 2) {
      let books = await BookSearch.searchbook(
        bookName,
        "AIzaSyC0IuLGYN3dgxC0fByTu0nCiqjVFragT-Y"
      );
      console.log(books.data);
      this.setState({
        dataSource: books.data,
        showFlatlist: true,
      });
    }
  }
  renderItem = ({ item, i }) => {
    console.log(item);
    return (
      <View>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#dddddd"
          onPress={() =>
            this.setState({
              showFlatlist: false,
              bookName: item.volumeInfo.title,
            })
          }
          style={styles.touchableHighlight}
          bottomDivider
        >
          <Text>Book Name: {item.volumeInfo.title}</Text>
        </TouchableHighlight>
        <Image style={styles.image} source={{ uri: item.image_link }} />
      </View>
    );
  };
  keyExtractor = (item, index) => index.toString();
  componentDidMount() {
    this.getBookRequest();
    this.getIsBookRequestActive();
  }
  render() {
    if (this.state.isBookRequestActive === true) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View
            style={{
              borderColor: "orange",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text>Book Name</Text>
            <Text>{this.state.requestedBookName}</Text>
          </View>
          <View
            style={{
              borderColor: "orange",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text> Book Status : {this.state.bookStatus}</Text>
          </View>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "orange",
              backgroundColor: "orange",
              width: 300,
              alignSelf: "center",
              alignItems: "center",
              height: 30,
              marginTop: 30,
            }}
            onPress={() => {
              this.sendNotification();
              this.updateBookRequestStatus();
              this.receivedBooks(this.state.requestedBookName);
            }}
          >
            <Text>I have received the book </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <AppHeader title="Request Book" navigation={this.props.navigation} />
          <View>
            <TextInput
              style={styles.formTextInput}
              placeholder={"Enter book name"}
              onChangeText={(text) => {
                this.getBooksFromAPI(text);
              }}
              value={this.state.bookName}
            />
            {this.state.showFlatlist ? (
              <FlatList
                data={this.state.dataSource}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                style={{ marginTop: 10 }}
                enableEmptySections
              />
            ) : (
              <View>
                <TextInput
                  style={[styles.formTextInput, { height: 300 }]}
                  multiline
                  numberOfLines={8}
                  placeholder={"Reason to Request"}
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
                    if (
                      this.state.bookName != "" &&
                      this.state.reason.length > 5
                    ) {
                      this.addRequest(this.state.bookName, this.state.reason);
                    } else {
                      Alert.alert("Please Enter Details");
                    }
                  }}
                >
                  <Text>Request</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      );
    }
  }
}

// <ScrollView>
//   <KeyboardAvoidingView style={styles.keyBoardStyle}>
//     <TextInput
//       style={styles.formTextInput}
//       placeholder={"Enter book name"}
//       onChangeText={(text) => {
//         this.setState({
//           bookName: text,
//         });
//       }}
//       value={this.state.bookName}
//     />
//     <TextInput
//       style={[styles.formTextInput, { height: 300 }]}
//       multiline
//       numberOfLines={8}
//       placeholder={"Reason to Request"}
//       onChangeText={(text) => {
//         this.setState({
//           reason: text,
//         });
//       }}
//       value={this.state.reason}
//     />
//     <TouchableOpacity
//       style={styles.button}
//       onPress={() => {
//         this.addRequest(this.state.bookName, this.state.reason);
//       }}
//     >
//       <Text>Request</Text>
//     </TouchableOpacity>
//   </KeyboardAvoidingView>
// </ScrollView>
const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formTextInput: {
    width: "75%",
    height: 35,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20,
  },
  touchableHighlight: {
    alignItems: "center",
    backgroundColor: "#ddd",
    padding: 10,
    width: "75%",
  },
  image: {
    height: 50,
    width: 50,
  },
});
