import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Input, CheckBox } from 'react-native-elements';

export class AddStudents extends React.Component {

  constructor(props) {
    super(props);

    this.user = this.props.navigation.getParam('user', {});
    this.addClass = this.props.navigation.getParam('AddClasses');

    this.isAdd = true;

    this.handleAdd = this.handleAdd.bind(this);

    this.state = {
      student: ""
    }
  }

  handleAdd = () => {
    let student = this.state.student

    if (this.isAdd) {
      this.addClass.handleAddStudents(student);
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
          <Text style={styles.headerTitle}>Add Students</Text>
        </View>
      </View>

      <View style={styles.bodyInput}>
        <View style={styles.containerCode}>
            <Text style={styles.bodyText}>Student Name: </Text>
            <Input
                placeholder= "Full Name"
                onChangeText={(value)=>{this.setState({student: value})}}
              />
        </View>
        </View>

        <View style={styles.addButton}>
        <TouchableOpacity style={styles.addBkg} onPress={this.handleAdd}>
          <Text style={styles.addText}>Add Student</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }

}

const styles = StyleSheet.create({
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