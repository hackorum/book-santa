import { createBottomTabNavigator } from "react-navigation-tabs";
import BookRequestScreen from "../screens/BookRequestScreen";
import { AppStackNavigator } from "./AppStackNavigator";

export const AppTabNavigator = createBottomTabNavigator({
  DonateBooks: {
    screen: AppStackNavigator,
    navigationOptions: {
      title: "Donate",
    },
  },
  RequestBooks: {
    screen: BookRequestScreen,
    navigationOptions: {
      title: "Request",
    },
  },
});
