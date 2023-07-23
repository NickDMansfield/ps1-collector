import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import Menuitem from './components/MenuItem';

function App() {
  const [gameList, setGameList] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

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

  return (
    <div className="App">
        <div style={{ display:'flex', flexDirection: 'column', scrollX: 'hidden', overflowX: 'wrap', overflowY:'scroll', height: '80vh'}}>
          {gameList.map((game, index) => (
            <Menuitem selectItemFunction={setSelectedGame} key={index} game={game} />
          ))}
        </div>
      <div>
        { selectedGame ? ( <h1>{selectedGame.name}</h1> ) : '' }
      </div>
    </div>
  );
}

export default App;