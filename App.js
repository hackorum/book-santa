import WelcomeScreen from "./screens/WelcomeScreen";
import { AppDrawerNavigator } from "./components/AppDrawerNavigator";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { LogBox } from "react-native";
import _ from "lodash";

LogBox.ignoreLogs(["Setting a timer"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

const SwitchNavigator = createSwitchNavigator({
  WelcomeScreen: {
    screen: WelcomeScreen,
  },
  Drawer: {
    screen: AppDrawerNavigator,
  },
});

export default createAppContainer(SwitchNavigator);
