import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { DrawerItems } from "react-navigation-drawer";
import firebase from "firebase";
import { Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import db from "../config";

export default class CustomSidebarMenu extends Component {
  state = {
    image: "#",
    uid: firebase.auth().currentUser.email,
    name: "",
    docId: "",
  };
  logOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate("WelcomeScreen");
      });
  };
  fetchImage = (uid) => {
    let storage = firebase
      .storage()
      .ref()
      .child("user_profiles/" + uid);
    storage
      .getDownloadURL()
      .then((url) => {
        this.setState({
          image: url,
        });
      })
      .catch((e) => {
        console.log(e);
        this.setState({ image: "#" });
      });
  };
  uploadImage = async (uri, uid) => {
    let response = await fetch(uri);
    let blob = await response.blob();
    let ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + uid);
    return ref.put(blob).then(() => {
      this.fetchImage(uid);
    });
  };
  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!cancelled) {
      this.setState({
        image: uri,
      });
      this.uploadImage(uri, this.state.uid);
    }
  };
  getUserProfile = () => {
    db.collection("users")
      .where("email", "==", this.state.uid)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          let data = doc.data();
          this.setState({
            name: data.firstName + " " + data.lastName,
            docId: doc.id,
            image: data.image,
          });
        });
      });
  };
  componentDidMount() {
    this.fetchImage(this.state.uid);
    this.getUserProfile();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.subView}>
          <Avatar
            rounded
            source={{ uri: this.state.image }}
            size="medium"
            containerStyle={styles.imageContainer}
            onPress={() => {
              this.selectPicture();
            }}
            showEditButton
          />
          <Text style={styles.text}>{this.state.name}</Text>
        </View>
        <View style={styles.drawerItemContainer}>
          <DrawerItems {...this.props} />
        </View>
        <View style={{ flex: 0.1 }}>
          <TouchableOpacity style={styles.button} onPress={this.logOut}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subView: {
    flex: 0.5,
    alignItems: "center",
  },
  imageContainer: {
    flex: 0.75,
    width: "40%",
    height: "20%",
    marginLeft: 20,
    marginTop: 30,
    borderRadius: 40,
  },
  text: {
    fontWeight: "bold",
    fontSize: 20,
    paddingTop: 20,
  },
  drawerItemContainer: {
    flex: 0.8,
    marginTop: 100,
  },
});
