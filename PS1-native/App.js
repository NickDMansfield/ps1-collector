import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import MenuItem from './components/MenuItem';
import SearchTool from './components/SearchTool/SearchTool';
import Toggle from 'react-native-toggle'; // Install this library separately using 'npm install react-native-toggle'
import formattedCSV from './formattedCSV'; // Import your formattedCSV data as a local file

export default function App() {
  const [gameList, setGameList] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [textFilter, setTextFilter] = useState('');

  const handleToggleChange = () => {
    if (selectedGame) {
      const updatedGameList = gameList.map(game => {
        if (game.name === selectedGame.name) {
          return { ...game, collected: !game.collected };
        }
        return game;
      });
      setGameList(updatedGameList);
      setSelectedGame(prevSelectedGame => ({
        ...prevSelectedGame,
        collected: !prevSelectedGame.collected,
      }));
    }
  };

  useEffect(() => {
    // Assuming 'formattedCSV' is an array of objects containing name and collected properties
    setGameList(formattedCSV.filter(gg => gg.name));
  }, []);

  const filteredGames = gameList.filter(game =>
    game.name?.toLowerCase()?.includes(textFilter.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <ScrollView style={{ flexGrow: 4 }}>
        {filteredGames.map((game, index) => (
          <MenuItem
            selectItemFunction={setSelectedGame}
            key={index}
            game={game}
          />
        ))}
      </ScrollView>
      <View style={styles.selectedGameContainer}>
        {selectedGame ? (
          <>
            <Text style={styles.selectedGameName}>{selectedGame.name}</Text>
            <Toggle
              style={styles.toggle}
              defaultOnValueChange={handleToggleChange}
              value={selectedGame.collected}
            />
          </>
        ) : null}
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Showing {filteredGames.length} of {gameList.length}
        </Text>
        <SearchTool textChangedSetter={setTextFilter} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectedGameContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedGameName: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 20,
  },
  toggle: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  footerText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
