import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, AsyncStorage, navigationOptions } from 'react-native';

import Firebase from './firebase';
import '@firebase/firestore';

export class MainScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      classes: {},
      style: "Class"
    }
    this.signOut = props.signOut;
    this.navigation = props.navigation
    this.classes = {}
    this.classes_list = []

    const db = Firebase.firestore();
    this.usersRef = db.collection('users');

    this.userDoc = this.usersRef.doc(props.user.id);

    this.addClass = this.addClass.bind(this);
    this.takeAttendance = this.takeAttendance.bind(this);
    this.settings = this.settings.bind(this);
    this.getStyle = this.getStyle.bind(this);
    
    this.getStyle();

    this.userDoc.get().then(function(doc) {
      if (doc.exists) {
        userData = doc.data();
        let classes_full = []
        for (let key in userData.classes) {
          if (userData.classes.hasOwnProperty(key)) {
            obj = {
              code: userData.classes[key].code,
              name: userData.classes[key].name
            }
            classes_full.push(obj)
          }
        }
        this.setState({
          classes: userData.classes,
          classes_list: Object.keys(userData.classes),
          classes_full: classes_full
        })
      } else {
        this.userDoc.set({
          name: props.user.name,
          email: props.user.email,
          familyName: props.user.familyName,
          givenName: props.user.givenName,
          photoUrl: props.user.photoUrl,
          classes: {}
        });
        this.setState({
          classes: {},
          classes_list: [],
          classes_full: []
        })
      }
    }.bind(this));
  }
  
  addClass() {
    this.navigation.navigate('AddClasses', {
      user: this.state.user,
      mainScreen: this,
      style: this.state.style
    });
  }

  async getStyle() {
    let style = await AsyncStorage.getItem("style");
    name = 'Event'
    if (style == 'faculty')
      name = 'Class'
    this.setState({
      style: name
    })
  }

  takeAttendance(course) {
    this.navigation.navigate('Attendance', {
      user: this.state.user,
      course: course,
      mainScreen: this
    });
  }

  viewAttendance(course) {
    this.navigation.navigate('AttendanceReport', {
      user: this.state.user,
      course: course,
      mainScreen: this
    });
  }

  settings() {
    this.navigation.navigate('Settings', {
      user: this.state.user,
      mainScreen: this
    });
  }

  changeSettings(style) {
    let name = 'Event'
    if (style == 'faculty')
      name = 'Class'
    this.setState({
      style: name
    })
  }

  addClassToState(newClass) {
    classes = this.state.classes;
    classes[newClass.code] = {
        code: newClass.code,
        name: newClass.name,
        students: newClass.students,
        attendance: newClass.attendance
    }
    this.userDoc.update({"classes": classes});
    classes_full = []
    for (let key in classes) {
      if (classes.hasOwnProperty(key)) {
        obj = {
          code: classes[key].code,
          name: classes[key].name
        }
        classes_full.push(obj)
      }
    }
    this.setState({
      classes: classes,
      classes_list: Object.keys(classes),
      classes_full: classes_full
    });
  }

  removeClass(code) {
    let classes = this.state.classes;
    delete classes[code]
    this.userDoc.update({"classes": classes});
    let classes_full = []
    for (let key in classes) {
      if (classes.hasOwnProperty(key)) {
        let obj = {
          code: classes[key].code,
          name: classes[key].name
        }
        classes_full.push(obj)
      }
    }
    this.setState({
      classes: classes,
      classes_list: Object.keys(classes),
      classes_full: classes_full
    })
  }
  
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerText}>Welcome {this.state.user.givenName}</Text>
          </View>
        </View>

        <View style={styles.body}>
        <FlatList
            style={styles.coursesContainer}
            data={this.state.classes_full}
            extraData={this.state}
            renderItem={({item, index}) => {
              return (
                  <View style={styles.courseContainerBody}>
                  <View style={styles.courseContainer}>
                    <TouchableOpacity onPress={() => this.takeAttendance(item.code)}>
                      <Text style={styles.courseTitle}>{item.code} - {item.name}</Text>
                      
                        <View>
                        <TouchableOpacity onPress={() => this.viewAttendance(item.code)}>
                        <Text style={styles.viewAttendanceText}>View Attendance</Text>
                        </TouchableOpacity>
                        </View>
                      
                        <View style={styles.deleteContainer}>
                        <TouchableOpacity onPress={() => this.removeClass(item.code)}>
                            <Image style={styles.deleteIcon} source={require('./images/trash.png')}/>
                        </TouchableOpacity>
                        </View>

                    </TouchableOpacity>
                  </View>
                  </View>
              )
            }}
            keyExtractor={(item, index) => index.toString()}/>
          <View style={styles.addClassButton}>
            <TouchableOpacity style={styles.addClassBkg} onPress={this.addClass}>
              <Text style={styles.addClassText}>Add {this.state.style}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <View style={styles.footerContainer}>
          <View>
            <TouchableOpacity>
            <Image style={styles.coursesImage} source={require('./images/Courses.png')}></Image>
            <Text style={styles.coursesTitle}>{this.state.style}</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={this.settings}>
            <Image style={styles.settingImage} source={require('./images/Setting.png')}></Image>
            <Text>Setting</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={this.signOut}>
            <Image style={styles.signOutImage} source={require('./images/SignOut.png')}></Image>
            <Text>Sign Out</Text>
            </TouchableOpacity>
          </View>
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
  container: {
    flex: 1,
  },
  header: {
    height: 70,
    backgroundColor: '#dca981',
  },
  headerTitle:{
    fontSize: 36,
    textAlign: 'center',
  },
  headerText: {
    fontSize: 18,
    textAlign: 'center',
  },
  body: {
    height: 450,
    padding: 20,
  },
  coursesContainer: {
    borderTopWidth: .5,
    borderColor: '#000',
    borderBottomWidth: .5,
    height: 300,
  },
  courseContainerBody: {
    padding: 5,
  },
  courseContainer: {
    height: 150,
    justifyContent: 'center',
    borderRadius: 20,
    borderColor: '#000000',
    borderWidth: 2,
  },
  courseTitle: {
    fontSize: 24,
    textAlign: 'center',
    padding: 15,
  },
  viewAttendanceText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#b06944'
  },
  deleteContainer: {
    marginTop: 15,
    alignItems: 'center'
  },
  deleteIcon: {
    height: 20,
    width: 18,
    padding: 5,
  },
  addClassButton: {
    justifyContent: 'flex-end',
    paddingLeft: 50,
    paddingRight: 50,
    marginTop: 10,
  },
  addClassBkg: {
    backgroundColor: '#351516', 
    height: 40,
  },
  addClassText: {
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 8,
    fontSize: 21,
    color: '#ffffff',
  },
  footerContainer: {
    height: 85,
    flexDirection: 'row',
    backgroundColor: '#b06944',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    padding: 30,
  },
  settingImage: {
    width: 50,
    height: 50,
  },
  signOutImage: {
    width: 45,
    height: 45,
    marginLeft: 8,
  },
  selectedPage: {
    backgroundColor: '#8d4d2b',
    width: 45,
    height: 50,
  },
  coursesImage: {
    width: 35,
    height: 45,
    marginLeft: 4,
  },
});