import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Switch } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import { styles } from './Styles';
import firebase from 'firebase';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBRpUcBCO0gjK2UD1oJj_kKA_AnJJy_4Fs",
    authDomain: "wookie-b28fa.firebaseapp.com",
    databaseURL: "https://wookie-b28fa.firebaseio.com",
    projectId: "wookie-b28fa",
    storageBucket: "wookie-b28fa.appspot.com",
    messagingSenderId: "98695939105",
    appId: "1:98695939105:web:a95e5285d6d65f5312cf60"
};

export class MainScreen extends React.Component {
}