import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity,ScrollView, Switch, Pressable, Modal} from 'react-native';
import MenuItem, {MemoIzedMenuItem} from './components/MenuItem';
import SearchTool from './components/SearchTool';

export default function App() {
  const [gameList, setGameList] = useState([]);
  const [selectedGamePrices, setSelectedGamePrices] = useState([{}]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [textFilter, setTextFilter] = useState('');
  const [priceModalOpen, setPriceModalOpen] = useState(false);

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
  
  const memoizedGameMenuItemClicked = useMemo(() => {
    return (game) => {
      setSelectedGame(game);

      const encodedString = encodeURI(game.name);
      const getGamePriceRegex = new RegExp('\\.com\\/game\\/playstation\\/[\\s\\S.]*?title="\\d*?">\\s*(.*?)<\\/a>[\\s\\S.]*?td\\sclass="console[\\s\\S.]*?span>\\s*?Playstation[\\s\\S.]*?cib_price[\\s\\S.]*?js-price">(.*?)<','gmi');
      fetch(`https://www.pricecharting.com/search-products?type=prices&q=${encodedString}&go=Go`)
        .then((response2) => response2.text())
        .then((htmlResp) => {
          var match;
          const gameVersionPrices = [];
          while ((match = getGamePriceRegex.exec(JSON.parse(JSON.stringify(htmlResp))))) {
            const matchVal = JSON.parse(JSON.stringify(match));
            const versionInfo = {};
            if (matchVal[1]) {
              console.log('name:' + matchVal[1]);
              versionInfo.name = matchVal[1];
            }
            if (matchVal[2]) {
              console.log('price:' + matchVal[2]);
              versionInfo.price = matchVal[2];
            }
            gameVersionPrices.push(versionInfo);
          }
          console.log(gameVersionPrices);
          setSelectedGamePrices(gameVersionPrices);
        });
    };
  }, []);

  useEffect(() => {
    // Fetch the CSV data from the local file
    fetch('https://raw.githubusercontent.com/NickDMansfield/ps1-collector/master/formattedCSV.csv')
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={priceModalOpen}
        onRequestClose={() => {
          setPriceModalOpen(!priceModalOpen);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
             {selectedGamePrices.map((game, index) => (
              <View>
                <Text>{game.name}</Text>
                <Text>{game.price}</Text>
              </View>
               ))}
          </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setPriceModalOpen(!priceModalOpen)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
        </View>
      </Modal>
      <ScrollView style={{flexGrow: 4}}>
        {filteredGames.map((game, index) => (
          <MemoIzedMenuItem
            selectItemFunction={memoizedGameMenuItemClicked}
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
        <View>
          <Text>{selectedGamePrices.length ? selectedGamePrices[0].price : ''}</Text>
          {selectedGamePrices.length > 1 ? (
            
            <TouchableOpacity
            onPress={() => setPriceModalOpen(true)}>
              <Text>+</Text>
            </TouchableOpacity>
          ) : ''}
        </View>
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
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    bottom: 20,
    right: 20,
    left: 20,
    height: '15vh'
  },
  footerText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
