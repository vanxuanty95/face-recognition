import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ClassList = () => {
  // Dummy data for class list
  const classes = [
    { id: 1, name: 'Math 101' },
    { id: 2, name: 'English 201' },
    { id: 3, name: 'History 301' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Classes:</Text>
      {classes.map((cls) => (
        <Text key={cls.id} style={styles.classItem}>{cls.name}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  classItem: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ClassList;