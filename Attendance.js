import React from 'react';
import { View, Text, Image, TextInput, FlatList, StyleSheet } from 'react-native';
import { Button, Input, CheckBox } from 'react-native-elements';
import Firebase from './firebase';

export class Attendance extends React.Component {
  
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (<Image style={styles.headerLogo} source={require('./images/WookieLogo.png')}/>),
    headerStyle: {backgroundColor: '#dca981', borderBottomWidth:0},
  })

  constructor(props) {
    super(props);

    this.state = {
      students: [],
      date: "",
      attendance: []
    }

    this.course = this.props.navigation.getParam('course', "");
    this.user = this.props.navigation.getParam('user', {});
    this.mainScreen = this.props.navigation.getParam('mainScreen');

    const db = Firebase.firestore();
    this.usersRef = db.collection('users');

    this.userDoc = this.usersRef.doc(this.user.id);

    this.submitAttendance = this.submitAttendance.bind(this);

    this.userDoc.get().then(function(doc) {
      if (doc.exists) {
        userData = doc.data();
        students = userData.classes[this.course].students;
        attendance = userData.classes[this.course].attendance;
        switcher = []
        for (let i = 0; i < students.length; i++)
          switcher.push(false)
        this.setState({
          students: students,
          switcher: switcher
        })
      }
    }.bind(this));
  }

  handleToggle(index) {
    switcher = this.state.switcher;
    switcher[index] = !switcher[index]
    this.setState({
      switcher: switcher
    })
  }

  submitAttendance() {
    let present_students = [];
    let switcher = this.state.switcher;
    let date = this.state.date;
    for (let i = 0; i < switcher.length; i += 1) {
        if (switcher[i]) {
            present_students.push(this.state.students[i]);
        }
    }
    if (date.length > 0) {
      attendance_object = {
          date: date,
          presentStudents: present_students
      }
      let attendance = this.state.attendance;
      attendance.push(attendance_object);
      let update_obj = {};
      update_obj[`classes.${this.course}.attendance`] = attendance;
      this.userDoc.update(update_obj).then(function() {
        let switcher = [];
        for (let i = 0; i < this.state.students.length; i++)
          switcher.push(false)
        this.setState({
          date: "",
          switcher: switcher
        })
      }.bind(this));
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Attendance</Text>
            <Text style={styles.headerText}>Please mark your attendance</Text>
          </View>
        </View>
        <View>
            <Input placeholder="Date" value={this.state.date} onChangeText={(value)=>{this.setState({date: value})}} />
        </View>
        <View>
          <FlatList
            style={styles.attendanceContainer}
            data={this.state.students}
            extraData={this.state}
            renderItem={({item, index}) => {
              return (
                <View>
                  <View style={styles.checkStudents}>
                    <CheckBox onPress={() => this.handleToggle(index)} checked={this.state.switcher[index]} />
                    <Text style={styles.studentName}>{item}</Text>
                  </View>
                </View>
              )
            }}
            keyExtractor={(item, index) => index.toString()} />
        </View>
        <View>
          <Button title="Submit Attendance" onPress={this.submitAttendance} />
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
    fontWeight: 'bold'
  },
  headerText: {
    fontSize: 18,
    textAlign: 'center',
  },
  attendanceContainer: {
    padding: 15,
  },
 checkStudentHeader:{
   flexDirection: 'row',
 },
  checkStudents: {
    flexDirection: 'row',
  },
  studentName: {
    textAlign: 'center',
    marginTop: 16,
    marginLeft: -15,
    fontSize: 18
  },
});