import React from 'react';
import './App.css';
import SudokuPane from "./components/SudokuPane";
import {strToDataArray} from "./utils/sudokuUtil";

function App() {
    const sourceStr = "031600490380194000500070600045702100960050074002309850009020008000936045037008960"
    const tempInitialGridData: string[][] = strToDataArray(sourceStr)
    const getData = (s : string[][])=>{
        console.log(s)
    }
    return (
        <div className="App">
            <h1 style={{width: "100%", textAlign: "center"}}>Light Sudoku</h1>
            <SudokuPane initialGridData={undefined} getCurrentGridData={getData}/>
        </div>
    );
}

export default App;
