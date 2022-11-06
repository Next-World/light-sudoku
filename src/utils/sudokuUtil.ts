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

export {
    checkSudokuIsValid
}