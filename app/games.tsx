import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

export default function GamesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [gameName, setGameName] = useState('');
  const [numPlayers, setNumPlayers] = useState('');
  const [numGames, setNumGames] = useState('');
  const [games, setGames] = useState([]);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const storedGames = await AsyncStorage.getItem('games');
      if (storedGames) {
        setGames(JSON.parse(storedGames));
      }
    } catch (error) {
      console.error('Failed to load games from storage', error);
    }
  };

  const handleAddGame = async () => {
    const newGame = {
      name: gameName,
      players: Array.from({ length: parseInt(numPlayers) }, () => ({ name: '', points: Array(parseInt(numGames)).fill('') })),
    };
    const updatedGames = [...games, newGame];
    setGames(updatedGames);
    try {
      await AsyncStorage.setItem('games', JSON.stringify(updatedGames));
    } catch (error) {
      console.error('Failed to save games to storage', error);
    }
    setModalVisible(false);
    setGameName('');
    setNumPlayers('');
    setNumGames('');
  };

  const handleDeleteGame = async (index) => {
    const updatedGames = games.filter((_, i) => i !== index);
    setGames(updatedGames);
    try {
      await AsyncStorage.setItem('games', JSON.stringify(updatedGames));
    } catch (error) {
      console.error('Failed to delete game from storage', error);
    }
  };

  const calculateTotalPoints = (points) => {
    return points.reduce((total, point) => total + (parseInt(point) || 0), 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Games Screen</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => {
          console.log('Add Game button clicked');
          setModalVisible(true);
        }}>
          <Ionicons name="add-circle" size={30} color="green" />
        </TouchableOpacity>
      </View>
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Game</Text>
            <TextInput
              style={styles.input}
              placeholder="Game Name"
              value={gameName}
              onChangeText={setGameName}
            />
            <TextInput
              style={styles.input}
              placeholder="Number of Players"
              value={numPlayers}
              onChangeText={setNumPlayers}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Number of Games"
              value={numGames}
              onChangeText={setNumGames}
              keyboardType="numeric"
            />
            <View style={styles.buttonRow}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Add" onPress={handleAddGame} />
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {games.map((game, index) => (
          <ScrollView horizontal={true} >
          <View key={index} style={styles.gameContainer}>
          <View style={styles.gameHeader}>
              <Text style={styles.gameTitle}>{game.name}</Text>
              <TouchableOpacity onPress={() => handleDeleteGame(index)}>
                <Ionicons name="close-circle" size={24} color="red" />
              </TouchableOpacity>
            </View>            
            {game.players.map((player, playerIndex) => (
              <View key={playerIndex} style={styles.playerRow}>
                <TextInput
                  style={styles.playerInput}
                  placeholder={`Player ${playerIndex + 1} Name`}
                  value={player.name}
                  onChangeText={(text) => {
                    const updatedGames = [...games];
                    updatedGames[index].players[playerIndex].name = text;
                    setGames(updatedGames);
                    AsyncStorage.setItem('games', JSON.stringify(updatedGames));
                  }}
                />
                <ScrollView scrollEnabled={false} contentContainerStyle={styles.pointsContainer}>
                  {player.points.map((point, pointIndex) => (
                    <TextInput
                      key={pointIndex}
                      style={styles.pointInput}
                      placeholder={`Game ${pointIndex + 1} Points`}
                      value={point}
                      onChangeText={(text) => {
                        if (/^\d*$/.test(text)) { // Allow only numbers
                          const updatedGames = [...games];
                          updatedGames[index].players[playerIndex].points[pointIndex] = text;
                          setGames(updatedGames);
                          AsyncStorage.setItem('games', JSON.stringify(updatedGames));
                        }
                      }}
                      keyboardType="numeric"
                    />
                  ))}
                </ScrollView>
                <Text style={styles.totalPoints}>{calculateTotalPoints(player.points)}</Text>
              </View>
            ))}
          </View>
          </ScrollView>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
  },
  addButton: {
    zIndex: 1, // Ensure the button is above other elements
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  gameContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10, // Add spacing between game fields
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  playerInput: {
    width: screenWidth * 0.2, // Fixed 20% of the screen width
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginRight: 10,
    borderRadius: 5,
    fontSize: 12, // Smaller font size
  },
  pointsContainer: {
    flexDirection: 'row',
  },
  pointInput: {
    width: screenWidth * 0.15, // 15% of the screen width
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 12, // Smaller font size
    marginRight: 5, // Add some spacing between point inputs
  },
  totalPoints: {
    width: 50,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});