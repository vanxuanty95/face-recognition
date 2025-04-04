import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FaceRecognitionScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Face Recognition Screen</Text>
      {/* Face Recognition Component will go here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default FaceRecognitionScreen;