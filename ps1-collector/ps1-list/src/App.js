import './App.css';
import { useState, useEffect } from 'react';
import Menuitem from './components/MenuItem';
import SearchTool from './components/SearchTool/SearchTool';
import Toggle from 'react-toggle';
import "react-toggle/style.css"

function App() {
  const [gameList, setGameList] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [textFilter, setTextFilter] = useState('')

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
    fetch('./formattedCSV.csv')
      .then(response => response.text())
      .then(responseText => {
        // the slice is to skip the header
        const csvRows = responseText.split('\n').slice(1); // Split by new line to get rows
        const parsedGameList = csvRows.map(csvRow => {
          const [name, collected] = csvRow.split(','); // Split by comma to get name and collected status
          return { name, collected: collected && collected.toLowerCase() === 'true' }; // Convert collected to a boolean
        }).filter(gg => gg.name);
        setGameList(parsedGameList);
      })
      .catch(error => {
        console.error('Error fetching CSV:', error);
      });
  }, []); // The empty dependency array ensures the effect runs only once on component mount

  const filteredGames = gameList.filter(game => game.name?.toLowerCase()?.indexOf(textFilter) >= 0);
  return (
    
    <div className="App">
        <div style={{ display:'flex', flexGrow:4, flexDirection: 'column', scrollX: 'hidden', overflowX: 'wrap', overflowY:'scroll', height: '80vh'}}>
          {filteredGames.map((game, index) => (
              <Menuitem selectItemFunction={setSelectedGame} key={index} game={game} />
          ))}
        </div>
      <div>
        <div style={{display:'flex', flexGrow: 1, paddingLeft: '3vw', paddingRight: '3vw', flexDirection: 'row', justifyContent:'space-between'}}>
          <div style={{fontWeight:600, fontSize: 24 }}>{ selectedGame ? selectedGame.name : '' }</div>
          <div style={{marginTop: '1vh'}}>{ selectedGame ? ( 
            
            <Toggle
            defaultChecked={selectedGame.collected}
            checked={selectedGame.collected}
            onChange={handleToggleChange}
            height='2vh'
            width='3vw' />
             ) : ''}
             </div>
        </div>
        <div style={{position: 'absolute', bottom: '6vh', right: '2vw' }}>
          Showing {filteredGames.length} of {gameList.length}
          </div>
        <div style={{position: 'absolute', bottom: 0, right: 0, marginRight: '2vw', marginBottom: '2vh'}}>
          <SearchTool textChangedSetter={setTextFilter} />
        </div>
      </div>
    </div>
  );
}

export default App;