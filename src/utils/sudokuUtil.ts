import type {Location} from "../components/SudokuPane/SudokuPane";


function checkSudokuIsValid(grid : string[][]) : Location[] {
    let valueLocationMap = new Map<string,Location[]>()
    let res : Location[] = []
    //check every row
    for(let i = 0; i < grid.length; i++){
        valueLocationMap.clear()
        for (let j = 0; j < grid[i].length; j++){
            if(grid[i][j] === "0"){
                continue
            }
            const location : Location  = { row: i,col : j,currentValue : parseInt(grid[i][j])}
            if(valueLocationMap.has(grid[i][j])){
                valueLocationMap.get(grid[i][j])!.push(location)
            } else {
                let locationArray: Location[] = [location];
                valueLocationMap.set(grid[i][j],locationArray);
            }
        }
        for(let value  of valueLocationMap.values()){
            if(value.length >= 2){
                res.push(...value)
            }
        }
    }

    //check every col
    for(let j = 0; j < grid[0].length; j++){
        valueLocationMap.clear()
        for (let i = 0; i < grid.length; i++){
            if(grid[i][j] === "0"){
                continue
            }
            const location : Location  = { row: i,col : j,currentValue : parseInt(grid[i][j])}
            if(valueLocationMap.has(grid[i][j])){
                valueLocationMap.get(grid[i][j])!.push(location)
            } else {
                let locationArray: Location[] = [location];
                valueLocationMap.set(grid[i][j],locationArray);
            }
        }
        for(let value  of valueLocationMap.values()){
            if(value.length >= 2){
                res.push(...value)
            }
        }
    }

    //check every block
    for(let i = 0; i < 3; i++){
        for(let j = 0;j < 3; j++){
            let startRow : number = i * 3
            let startCol : number = j * 3
            valueLocationMap.clear()
            for(let r = startRow; r < startRow + 3; r++){
                for(let c = startCol; c < startCol + 3; c++){
                    if(grid[r][c] === "0"){
                        continue
                    }
                    const location : Location  = { row: r,col : c,currentValue : parseInt(grid[r][c])}
                    if(valueLocationMap.has(grid[r][c])){
                        valueLocationMap.get(grid[r][c])!.push(location)
                    } else {
                        let locationArray: Location[] = [location];
                        valueLocationMap.set(grid[r][c],locationArray);
                    }
                }
            }
            for(let value  of valueLocationMap.values()){
                if(value.length >= 2){
                    res.push(...value)
                }
            }

        }
    }
    return res
}

function strToDataArray(str : string) {
    if(str.length !== 81){
        return Array.from({length:9},()=>Array.from({length:9},()=>"0"))
    }
    let ans : string[][] = [];
    for (let i = 0; i < 9; i++ ){
        ans[i] = str.substring(i * 9,(i + 1) * 9).split("")
    }
    return ans;
}

function resolveSudoku(grid : string[][]){
    // Helper function to check if a number is valid in a given row and column
    function isValid(row: number, col: number, num: string): boolean {
        // Check the row
        for (let i = 0; i < 9; i++) {
            if (grid[row][i] === num) {
                return false;
            }
        }

        // Check the column
        for (let i = 0; i < 9; i++) {
            if (grid[i][col] === num) {
                return false;
            }
        }

        // Check the 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if (grid[i][j] === num) {
                    return false;
                }
            }
        }

        // The number is valid in this position
        return true;
    }

    // Helper function to find the next empty cell
    function getNextEmptyCell(): [number, number] | null {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === "0") {
                    return [row, col];
                }
            }
        }
        return null;
    }

    // Recursive function to solve the puzzle
    function solve(): boolean {
        const nextCell = getNextEmptyCell();
        if (nextCell === null) {
            // The puzzle is solved
            return true;
        }

        const [row, col] = nextCell;

        for (let num = 1; num <= 9; num++) {
            if (isValid(row, col, String(num))) {
                grid[row][col] = String(num);
                if (solve()) {
                    return true;
                }
                grid[row][col] = "0";
            }
        }

        // No valid number was found in this position
        return false;
    }
    // Start solving the puzzle
    return solve();
}


export {
    checkSudokuIsValid,
    strToDataArray,
    resolveSudoku
}