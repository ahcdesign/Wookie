import React from 'react';
import { View, Text, StyleSheet, Switch, AsyncStorage, Image } from 'react-native';
import { Button, Input, CheckBox } from 'react-native-elements';

export class Settings extends React.Component {
    static navigationOptions = ({ navigation }) => ({
      headerTitle: (<Image style={styles.headerLogo} source={require('./images/WookieLogo.png')}/>),
      headerStyle: {backgroundColor: '#dca981', borderBottomWidth:0},
    })

    constructor(props) {
        super(props);
        this.user = this.props.navigation.getParam('user', {});
        this.mainScreen = this.props.navigation.getParam('mainScreen');
        
        this.state = {
          style: 'faculty',
          toggle: false,
          qr: false
        }
        this.getStorageValue = this.getStorageValue.bind(this);
        this.setStorageValue = this.setStorageValue.bind(this);
        this.toggleValue = this.toggleValue.bind(this);
        this.toggleqr = this.toggleqr.bind(this);
        this.getStorageValue();
    }

    async getStorageValue() {
      let style = await AsyncStorage.getItem("style");
      if (style == 'faculty')
        toggle = false
      else
        toggle = true
      this.setState({
        style: style,
        toggle: toggle
      });
    }

    async setStorageValue(style) {
      await AsyncStorage.setItem("style", style);
      if (style == 'faculty')
        toggle = false
      else
        toggle = true
      console.log("Check", style, toggle)
      this.setState({
        style: style,
        toggle: toggle
      })
      this.mainScreen.changeSettings(style);
    }

    toggleValue() {
      let style = this.state.style;
      if (style == 'faculty')
        this.setStorageValue('organization')
      else
        this.setStorageValue('faculty')
    }
    
    toggleqr() {
      let qr = !this.state.qr;
      console.log(qr);
      this.setState({qr: qr})
    }
    

    render() {
        return (
        <View>
          <View style={styles.header}>
            <View>
            <Text style={styles.headerTitle}>Settings</Text>
            </View>
          </View>
          
          <Text style={styles.adminQuestion}>Are you a faculty or a student organization officer?</Text>
          <View style={styles.mainToggleBody}>
            <Text style={styles.adminText}>Faculty/Staff</Text> 
            <Switch value={this.state.toggle} onValueChange={this.toggleValue}/> 
            <Text style={styles.adminText2}>Student Officer</Text>
          </View>

          <View>
          <Text style={styles.selectTitle}>Attendance Preference</Text>
          <View style={styles.selectList}>
            <Text style={styles.selectText}> QR Code </Text>
            <Switch value={this.state.qr} onValueChange={this.toggleqr}/> 
          </View>
          </View>

        </View>
    );
    }
}

const styles = StyleSheet.create({
  headerLogo: {
    resizeMode: 'contain',
    aspectRatio: 4
  },
  header: {
    height: 70,
    backgroundColor: '#dca981',
  },
  headerTitle: {
    fontSize: 36,
    marginTop: 10,
    textAlign: 'center',
  },
  adminQuestion: {
    padding: 10,
    textAlign: 'center'
  },
  adminText: {
    marginRight: 10,
  },
  adminText2:{
    marginLeft: 10,
  },
  touchable: {
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    shadowOffset: { width: 0, height: 1 },
    overflow: 'visible',
    shadowColor: 'black',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  mainToggleBody: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  selectList: {
    flexDirection: 'row',
    padding: 10,
  },
  selectText: {
    fontSize: 18,
    marginTop: 3,
    paddingRight:215,
  }
});