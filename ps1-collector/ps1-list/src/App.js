import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import Menuitem from './components/MenuItem';
import SearchTool from './components/SearchTool/SearchTool';

function App() {
  const [gameList, setGameList] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [textFilter, setTextFilter] = useState('')

  const saveChanges = function() {

  }

  useEffect(() => {
    fetch('./formattedCSV.csv')
      .then(response => response.text())
      .then(responseText => {
        const csvRows = responseText.split('\n'); // Split by new line to get rows
        const parsedGameList = csvRows.map(csvRow => {
          const [name, collected] = csvRow.split(','); // Split by comma to get name and collected status
          return { name, collected: collected && collected.toLowerCase() === 'true' }; // Convert collected to a boolean
        });
        setGameList(parsedGameList);
      })
      .catch(error => {
        console.error('Error fetching CSV:', error);
      });
  }, []); // The empty dependency array ensures the effect runs only once on component mount

  const filteredGames = gameList.filter(game => game.name?.toLowerCase()?.indexOf(textFilter) >= 0);
  return (
    
    <div className="App">
        <div style={{ display:'flex', flexDirection: 'column', scrollX: 'hidden', overflowX: 'wrap', overflowY:'scroll', height: '80vh'}}>
          {filteredGames.map((game, index) => (
              <Menuitem selectItemFunction={setSelectedGame} key={index} game={game} />
          ))}
        </div>
      <div>
        { selectedGame ? ( <h1>{selectedGame.name}</h1> ) : '' }
        <div style={{position: 'absolute', bottom: 0, right: 0, marginRight: '2vw', marginBottom: '2vh'}}>
          Showing {filteredGames.length} of {gameList.length}
          <SearchTool textChangedSetter={setTextFilter} />
        </div>
      </div>
    </div>
  );
}

export default App;