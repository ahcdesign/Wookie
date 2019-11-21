import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const AppNavigator = createStackNavigator(
  {
    Home: Courses,
    Preferences: SettingsScreen,
    CoursePreferences: CourseSettingScreen,
    Course: RosterList,
  },
  {
    initialRouteName: 'Home',
  }
);
const AppContainer = createAppContainer(AppNavigator);
export default AppContainer;