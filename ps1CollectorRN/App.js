import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Switch} from 'react-native';
import MenuItem, {MemoIzedMenuItem} from './components/MenuItem';
import SearchTool from './components/SearchTool';

export default function App() {
  const [gameList, setGameList] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [textFilter, setTextFilter] = useState('');

  const handleToggleChange = () => {
    if (selectedGame) {
      const updatedGameList = gameList.map(game => {
        if (game.name === selectedGame.name) {
          return {...game, collected: !game.collected};
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
    // Fetch the CSV data from the local file
    fetch(
      'https://raw.githubusercontent.com/NickDMansfield/ps1-collector/master/formattedCSV.csv',
    )
      .then(response => response.text())
      .then(csvData => {
        // Split the CSV data into rows
        const csvRows = csvData.split('\n').slice(1); // Split by new line to get rows
        const parsedGameList = csvRows
          .map(csvRow => {
            const [name, collected] = csvRow.split(','); // Split by comma to get name and collected status
            return {
              name,
              collected: collected && collected.toLowerCase() === 'true',
            }; // Convert collected to a boolean
          })
          .filter(gg => gg.name);
        setGameList(parsedGameList);
      })
      .catch(error => {
        console.error('Error fetching CSV data:', error);
      });
  }, []);

  const filteredGames = gameList.filter(game =>
    game.name?.toLowerCase()?.includes(textFilter.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <ScrollView style={{flexGrow: 4}}>
        {filteredGames.map((game, index) => (
          <MemoIzedMenuItem
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
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleToggleChange}
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
    transform: [{scaleX: 1.5}, {scaleY: 1.5}],
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
