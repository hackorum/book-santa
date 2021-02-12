import { createDrawerNavigator } from "react-navigation-drawer";
import { AppTabNavigator } from "./AppTabNavigator";
import CustomSidebarMenu from "./CustomSidebarMenu";
import SettingScreen from "../screens/SettingScreen";
import MyDonationScreen from "../screens/MyDonationScreen";
import NotificationScreen from "../screens/NotificationScreen";
import MyReceivedBookScreen from "../screens/MyReceivedBookScreen";

export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator,
    },
    MyDonations: {
      screen: MyDonationScreen,
      navigationOptions: {
        title: "My Donations",
      },
    },
    NotificationScreen: {
      screen: NotificationScreen,
      navigationOptions: {
        title: "Notifications",
      },
    },
    MyReceivedBookScreen: {
      screen: MyReceivedBookScreen,
      navigationOptions: {
        title: "Received Books",
      },
    },
    Settings: {
      screen: SettingScreen,
    },
  },
  {
    contentComponent: CustomSidebarMenu,
  },
  {
    initialRouteName: "Home",
  }
);
