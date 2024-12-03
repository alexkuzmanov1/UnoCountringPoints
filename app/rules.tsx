import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function RulesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Rules Screen</Text>
      <Text style={styles.text}>
        Every number that is coloured is corresponding to the points. Every coloured special card is 20 points. Every black card is 50 points. The winner of each game gets -10 points. The winner is the one with the least points at the end of all games.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 20,
  },
});