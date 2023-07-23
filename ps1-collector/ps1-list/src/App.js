import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import Menuitem from './components/MenuItem';

function App() {
  const [gameList, setGameList] = useState([]);

  useEffect(() => {
    fetch('./formattedCSV.csv')
      .then(response => response.text())
      .then(responseText => {
        const csvRows = responseText.split('\n'); // Split by new line to get rows
        const parsedGameList = csvRows.map(csvRow => {
          const [name, collected] = csvRow.split(','); // Split by comma to get name and collected status
          return { name, collected: collected === 'true' }; // Convert collected to a boolean
        });
        setGameList(parsedGameList);
      })
      .catch(error => {
        console.error('Error fetching CSV:', error);
      });
  }, []); // The empty dependency array ensures the effect runs only once on component mount

  return (
    <div className="App">
      <header className="App-header">
        {gameList.map((game, index) => (
          <Menuitem key={index} name={game.name} collected={game.collected} />
        ))}
      </header>
    </div>
  );
}

export default App;