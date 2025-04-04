import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CheckinSuccessScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check-in Success!</Text>
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

export default CheckinSuccessScreen;