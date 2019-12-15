import React from 'react';
import { View, Text, Image, TextInput, FlatList, StyleSheet } from 'react-native';
import { Button, Input, CheckBox } from 'react-native-elements';
import Firebase from './firebase';

export class AttendanceReport extends React.Component {
  
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (<Image style={styles.headerLogo} source={require('./images/WookieLogo.png')}/>),
    headerStyle: {backgroundColor: '#dca981', borderBottomWidth:0},
  })

  constructor(props) {
    super(props);

    this.state = {
      attendance: []
    }

    this.course = this.props.navigation.getParam('course', "");
    this.user = this.props.navigation.getParam('user', {});
    this.mainScreen = this.props.navigation.getParam('mainScreen');

    const db = Firebase.firestore();
    this.usersRef = db.collection('users');

    this.userDoc = this.usersRef.doc(this.user.id);

    this.userDoc.get().then(function(doc) {
      if (doc.exists) {
        let userData = doc.data();
        let attendance = userData.classes[this.course].attendance;
        let students = userData.classes[this.course].students;
        let student_attendance_obj = {}
        let total_classes = attendance.length;
        for (let i = 0; i < students.length; i += 1) {
            student_attendance_obj[students[i]] = 0
        }
        for (let i = 0; i < attendance.length; i++) {
            for (let j = 0; j < attendance[i].presentStudents.length; j += 1) {
                let student = attendance[i].presentStudents[j]
                if (student in student_attendance_obj) {
                    student_attendance_obj[student] += 1;
                } else {
                    student_attendance_obj[student] = 1
                }
            }
        }

        let student_attendance = []
        for (let student in student_attendance_obj) {
            if (student_attendance_obj.hasOwnProperty(student)) {
                if (total_classes == 0)
                    percent = "0%";
                else {
                    percent = ((student_attendance_obj[student] / total_classes) * 100).toFixed(2).toString() + "%";
                }
                student_attendance.push({
                    student: student,
                    fraction: student_attendance_obj[student].toString() + "/" + total_classes.toString(),
                    percentage: percent
                });
            }
        }
        this.setState({
          attendance: student_attendance
        })
      }
    }.bind(this));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Attendance Report</Text>
          </View>
        </View>
        
        <View style={styles.Detail}>
          <Text style={styles.DetailText}>Student Name |</Text>
          <Text style={styles.DetailText}> Ratio |</Text>
          <Text style={styles.DetailText}> Percentage</Text>
        </View>
        <View>
          <FlatList
            style={styles.attendanceContainer}
            data={this.state.attendance}
            extraData={this.state}
            renderItem={({item, index}) => {
              return (
                <View>
                  <View style={styles.checkStudents}>
                    <Text style={styles.studentName}>{item.student} |</Text>
                    <Text style={styles.studentFraction}> {item.fraction} |</Text>
                    <Text style={styles.studentPercentage}> {item.percentage}</Text>
                  </View>
                </View>
              )
            }}
            keyExtractor={(item, index) => index.toString()} />
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
  headerTitle: {
    fontSize: 36,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  Detail: {
    marginLeft: 15,
    marginTop: 15,
    flexDirection: 'row'
  },
  DetailText: {
    fontWeight: 'bold',
  },
  attendanceContainer: {
    padding: 5,
  },
  checkStudents: {
    flexDirection: 'row',
    marginLeft: 25,
  },
  studentName: {
    textAlign: 'center',
    marginTop: 16,
    marginLeft: -15,
    fontSize: 18
  },
  studentFraction: {
    textAlign: 'center',
    marginTop: 16,
    marginLeft: 5,
    fontSize: 18
  },
  studentPercentage: {
    textAlign: 'center',
    marginTop: 16,
    marginLeft: 5,
    fontSize: 18
  },
});