import React from 'react';
import './App.css';
import SudokuPane from "./components/SudokuPane";

function App() {
  return (
    <div className="App">
        <h1>Light Sudoku</h1>
        <SudokuPane />
    </div>
  );
}

export default App;
