import * as Google from 'expo-google-app-auth';
import React, { Component } from 'react';
import { Image, StyleSheet, Text, View, AsyncStorage } from 'react-native';

import GoogleSignInButton from './GoogleSignInButton';

import { MainScreen } from './Main';

const config = {
  iosClientId: '384277833802-t9mhrsrlfuk0lqjlr7b2scj81og44h77.apps.googleusercontent.com',
  androidClientId: '384277833802-9koo9mosjo5ae0chcnm80v7n52qhmlku.apps.googleusercontent.com',
  scopes: ['profile', 'email']
}

function CorrectComponent(props) {
    if (props.id == null) {
      return <View style={styles.signinContainer}>
        <Image style={styles.logo} source={require('./images/WookieLogo.png')}/>
        <Text style={styles.title}>Wookie</Text>
        <GoogleSignInButton onPress={props.callback}>
          {"Sign In with Google"}
        </GoogleSignInButton>
        <Image style={styles.touch} source={require('./images/TouchID.png')}></Image>
        <Text style={styles.touchText}>Touch ID</Text>
        <Text style={styles.touchSubtext}>Use your fingerprint to login</Text>
        <Text style={styles.subText}>Join the Force</Text>
        </View>
    } else {
      return <MainScreen user={props.user} signOut={props.signOut} navigation={props.navigation}/>
    }
}


export class Login extends React.Component {
  
  static navigationOptions = ({ navigation }) => ({
    headerStyle: {backgroundColor: '#dca981', borderBottomWidth:0},
  })
  
  state = { user: null };

  constructor(props) {
    super(props);
    this.state = {
      user_id: null
    }

    this.getUserVariables = this.getUserVariables.bind(this);
    this.signInWithGoogleAsync = this.signInWithGoogleAsync.bind(this);
    this.signOut = this.signOut.bind(this);
    this.getUserVariables();
  }

  async getUserVariables() {
    let user = {}
    user.id = await AsyncStorage.getItem("user");
    user.email = await AsyncStorage.getItem("email");
    user.name = await AsyncStorage.getItem("name");
    user.familyName = await AsyncStorage.getItem("familyName");
    user.givenName = await AsyncStorage.getItem("givenName");
    user.photoUrl = await AsyncStorage.getItem("photoUrl");

    let accessToken = await AsyncStorage.getItem("accessToken");
    this.setState({
      user: user,
      user_id: user.id,
      accessToken: accessToken
    })
  }

  async signInWithGoogleAsync() {
    try {
      const result = await Google.logInAsync(config);
      console.log("Result", result)
      if (result.type === 'success') {
        await AsyncStorage.setItem('user', result.user.id);
        await AsyncStorage.setItem('email', result.user.email);
        await AsyncStorage.setItem('name', result.user.name);
        await AsyncStorage.setItem('familyName', result.user.familyName);
        await AsyncStorage.setItem('givenName', result.user.givenName);
        await AsyncStorage.setItem('photoUrl', result.user.photoUrl);
        await AsyncStorage.setItem('style', 'faculty');
        await AsyncStorage.setItem('accessToken', result.accessToken);
        console.log(result.user)
        this.setState({
          user: result.user,
          accessToken: result.accessToken,
          user_id: result.user.id
        });
      } else {
        console.log("Oops, cancelled")
        return { cancelled: true };
      }
    } catch (e) {
      console.log("Oops, exception", e)
      return { error: true };
    }
  }

  async signOut() {
    // await Google.logOutAsync({this.state.accessToken, ...config})
    // await Google.logOutAsync(this.state.accessToken, config)
    console.log("hello, clearing stuff")
    await AsyncStorage.clear();
    this.setState({
      user: null,
      user_id: null,
      accessToken: null
    })
  }

  toggleAuth = () => {
    console.log('Toggle', !!this.state.user);
    if (this.state.user) {
      this._signOutAsync();
    } else {
      this.signInWithGoogleAsync();
    }
  };

  render() {
    return (
      <View>
        <CorrectComponent user={this.state.user} id={this.state.user_id} 
        callback={this.signInWithGoogleAsync} signOut={this.signOut}
        navigation={this.props.navigation}/>        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  signinContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: { 
    width: 128, 
    borderRadius: 64, 
    aspectRatio: 1 
  },
  touch: {
    height: 75,
    width: 75,
    marginTop: 45,
  },
  touchText: {
    fontSize: 21,
    paddingTop: 5,
  },
  touchSubtext: {
    fontSize: 10,
  },
  text: { 
    color: 'black', 
    fontSize: 16, 
  },
  subText: {
    fontSize: 14,
    marginTop: 30,
  },
  title:{
    fontSize: 36,
    paddingBottom: 20,
  },
  logo: {
    marginTop: 50,
    height: 150,
    width: 150,
  },
});
