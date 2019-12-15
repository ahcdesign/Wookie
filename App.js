import React from 'react';
import { Image, StyleSheet, Text, View, Platform, AsyncStorage} from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { MainScreen } from './Main';
import { Login } from './Login';
import { AddClasses } from './AddClasses';
import { Settings } from './Settings';
import { AddStudents } from './AddStudents';
import { Attendance } from './Attendance';
import { AttendanceReport } from './AttendanceReport';


const AppNavigator = createStackNavigator(
  {
    Login: Login,
    Home: MainScreen,
    AddClasses: AddClasses,
    Settings: Settings,
    AddStudents: AddStudents,
    Attendance: Attendance,
    AttendanceReport: AttendanceReport
  },
  {
    initialRouteName: 'Login',
  }
);

const AppContainer = createAppContainer(AppNavigator);
export default AppContainer;