import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Button, Input, CheckBox } from 'react-native-elements';

export class AddClasses extends React.Component {
  
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (<Image style={styles.headerLogo} source={require('./images/WookieLogo.png')}/>),
    headerStyle: {backgroundColor: '#dca981', borderBottomWidth:0},
  })

  constructor(props) {
    super(props);

    this.user = this.props.navigation.getParam('user', {});
    this.mainScreen = this.props.navigation.getParam('mainScreen');
    this.style = this.props.navigation.getParam('style');
    console.log(this.style);

    let header = "New Class"
    let input1 = "Course Code"
    let input2 = "Course Name"
    let button = "Add Class"
    
    if (this.style != "Class") {
        header = "New Event"
        input1 = "Event Code"
        input2 = "Event Name"
        button = "Add Event"
    }

    this.navigateToAddStudent = this.navigateToAddStudent.bind(this);

    this.isAdd = true;

    this.state = {
      code: "",
      name: "",
      students: [],
      attendance: [],
      students_string: "",
      header: header,
      input1: input1,
      input2: input2,
      button: button
    }
  }

  handleAddStudents(student) {
    if (student != "") {
      students = this.state.students
      students.push(student)
      this.setState({
        students: students,
        students_string: students.toString()
      })
    }
  }

  navigateToAddStudent(student) {
    this.props.navigation.navigate('AddStudents', {
      AddClasses: this
    });
  }

  handleAdd = () => {
    let newClass = {
      code: this.state.code,
      name: this.state.name,
      students: this.state.students,
      attendance: this.state.attendance
    };

    if (this.isAdd) {
      this.mainScreen.addClassToState(newClass);
    } else {
      // newEntry.key = this.entryToUpdate.key;
      // mainScreen.updateEntry(newEntry);
    }
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={styles.container}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{this.state.header}</Text>
          </View>
        </View>
        
        <View style={styles.bodyInput}>
        <View style={styles.containerCode}>
            <Text style={styles.bodyText}>{this.state.input1}: </Text>
            <Input
                placeholder={this.state.input1}
                onChangeText={(value)=>{this.setState({code: value})}}
              />
        </View>
        <View style={styles.containerTitle}>
            <Text style={styles.bodyText}>{this.state.input2}: </Text>
            <Input
                placeholder={this.state.input2}
                onChangeText={(value)=>{this.setState({name: value})}}
              />
        </View>
        </View>

        <View style={styles.nameList}>
          <Text style={styles.nameListTitle}>List of Students</Text>
          <Text>{this.state.students_string}</Text>
        </View>

        <View style={styles.addButton}>
          <TouchableOpacity style={styles.addBkg} onPress={this.navigateToAddStudent}>
            <Text style={styles.addText}>Add Student</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.addButton}>
            <TouchableOpacity style={styles.addBkg} onPress={this.handleAdd}>
            <Text style={styles.addText}>{this.state.button}</Text>
            </TouchableOpacity>
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
  },
  bodyInput: {
    padding: 25,
  },
  bodyText: {
    marginLeft: 10,
  },
  containerTitle: {
    paddingTop: 20,
  },
  containerList: {
    height: 50,
  },
  nameList: {
    padding: 5,
    marginLeft: 30,
  },
  nameListTitle: {
    fontSize: 18,
    paddingBottom: 10,
  },
  addButton: {
    paddingLeft: 50,
    paddingRight: 50,
    marginTop: 10,
  },
  addBkg: {
    backgroundColor: '#351516', 
    height: 40,
  },
  addText: {
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 8,
    fontSize: 21,
    color: '#ffffff',
  },
});