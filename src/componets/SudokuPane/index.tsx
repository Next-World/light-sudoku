import React, {useState} from 'react';
import SudokuPaneStyle from './SudokuPane.module.scss'
import MarkEditItem from "../MarkEditItem";

interface Location {
    row : number,
    col : number,
    currentValue : number
}

type EditMark = number[]

function SudokuPane(){
    const initLocation : Location = {row : -1,col : -1, currentValue : -1}

    const optionNumberList : number[] = Array.from({length:9},(x,i)=>i + 1)

    const strToDataArray = (str : string) => {
        if(str.length !== 81){
            return Array.from({length:9},()=>Array.from({length:9},()=>"0"))
        }
        let ans : string[][] = [];
        for (let i = 0; i < 9; i++ ){
            ans[i] = str.substring(i * 9,(i + 1) * 9).split("")
        }
        return ans;
    }
    const InitEditMarks = ()=>{
        let ans = new Array(9).fill(null)
        for (let i in ans){
            ans[i] = new Array(9).fill(null)
            for (let j in ans[i]){
                ans[i][j] = new Array(9).fill(0)
            }
        }
        return ans;
    }
    let sourceStr = "021600490380194000500070600045702100960050074002309850009020008000936045037008960"
    const initialGridData :string[][] = strToDataArray(sourceStr)


    const [selectLocation,setSelectLocation] = useState<Location>(initLocation)
    const [editGridData,setEditGridData] = useState<string[][]>(initialGridData)
    const initialWarmingList : Location[] = []
    const [warmingList,setWarmingList] = useState<Location[]>(initialWarmingList)
    const [markModel,setMarkModel] = useState<boolean>(false)
    // const emptyMarkItem : EditMark = new Array<number[]>(3).fill(new Array<number>(3).fill(0))
    const initialEditMarks : EditMark[][] = InitEditMarks()
    const [editMarks,setEditMarks] = useState<EditMark[][]>(initialEditMarks)


    const onItemClickHandler = (col : number, row : number, value : string) => {
        console.log("col = " + col + ",row = "  + row)
        const currentValue : number = value === "0" ? -1 : parseInt(value)
        const selectLocation : Location = {col,row,currentValue}
        setSelectLocation(selectLocation)
    }

    const CheckIfWarming = (row : number, col : number) =>{
        // let warmingList : Location[] = []
        // for (let i = 0; i < 9; i++){
        //     if(oldGridData[row][i] === newValue){
        //         warmingList.push({row : row,col : i,currentValue : parseInt(newValue)})
        //     }
        // }
        // for (let i = 0; i < 9; i++){
        //     if(oldGridData[i][col] === newValue){
        //         warmingList.push({row : i,col : col,currentValue : parseInt(newValue)})
        //     }
        // }
        // const startRow : number = Math.floor(row / 3) * 3 + 1
        // const startCol : number = Math.floor( col / 3) * 3 + 1
        // console.log("startRow = %i, startCol = %i,row = %i, col = %i",startRow,startCol,row,col)
        // for(let i = startRow; i < startRow + 3; i++){
        //     for(let j = startCol; j < startCol + 3; j++){
        //         if(oldGridData[i][j] === newValue){
        //             warmingList.push({row : i,col : j,currentValue : parseInt(newValue)})
        //         }
        //     }
        // }
        //
        // return warmingList;
    }

    const onOptionNumberClickHandler = (value : number) => {
        console.log("onclick value = " + value);


        //标记模式
        if(markModel){
            setEditMarks((prevState)=>{
                const currentRow = selectLocation.row;
                const currentCol = selectLocation.col;
                let newEditMarks : EditMark[][] = [...prevState]

                let editMarkItem : EditMark = [...prevState[currentRow][currentCol]]
                if(value === 0){
                    editMarkItem.fill(0)
                } else {
                    if(editMarkItem[value - 1] === value){
                        console.log("clear value" + value)
                        editMarkItem[value - 1] = 0
                    } else {
                        console.log("value=>%i", value)
                        editMarkItem[value - 1] = value
                        console.log(editMarkItem)
                    }
                }
                newEditMarks[currentRow] = [...prevState[currentRow]]
                newEditMarks[currentRow][currentCol] = [...editMarkItem]
                return newEditMarks
            })
            return;
        }


        setEditGridData((prevEditGridData  => {
            console.log("update grid")
            const currentRow = selectLocation.row;
            const currentCol = selectLocation.col;
            if(currentRow === -1 || currentCol === -1){
                return prevEditGridData
            }
            const newGridData : string[][] = [...prevEditGridData]
            console.log(initialGridData)
            if(initialGridData[currentRow][currentCol] !== "0"){
                return newGridData;
            }
            newGridData[currentRow] = [...prevEditGridData[currentRow]]
            newGridData[currentRow][currentCol] = value.toString();
            console.log(newGridData[currentRow][currentCol])
            return newGridData
        }))
    }


    const checkIfInWarmingList = (row : number, col : number) =>{
        for(let i in warmingList){
            if(row === warmingList[i].row && col === warmingList[i].col){
                return true
            }
        }
        return false;
    }

    const changeEditMarkHandler = () =>{
        const newMarkModel : boolean = !markModel;
        setMarkModel(newMarkModel)
    }

    return (
        <>
        <div className={SudokuPaneStyle.container}>
            <div className={SudokuPaneStyle.sudokuPane}>
                <table style={{borderCollapse:"collapse"}}>
                    <tbody>
                    {editGridData.map((rowValue, row) =>
                        <tr key = {row}>
                            {rowValue.map((value, col) =>
                                <td key={row+col}
                                    className={`${SudokuPaneStyle.sudokuItem} 
                                                ${((col + 1 )% 3 === 0 && col !== 8 ? SudokuPaneStyle.rightBorder : null)} 
                                                ${((row + 1 ) % 3 === 0 && row !== 8 ? SudokuPaneStyle.bottomBorder : null)}
                                                ${initialGridData[row][col] === "0" ? SudokuPaneStyle.inputItem : null}
                                                ${(row === selectLocation.row && col === selectLocation.col) || value === selectLocation.currentValue.toString() 
                                                    ? SudokuPaneStyle.selectItem : null}
                                                ${checkIfInWarmingList(row,col) ? SudokuPaneStyle.warmingItem : null}`}
                                    onClick={()=>(onItemClickHandler(col,row,value))}>
                                    {value === "0" ? <MarkEditItem markValues={editMarks[row][col]}/> : value}
                                </td>
                            )}
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
        <div className={SudokuPaneStyle.editBarContainer}>
            <table>
                <tbody>
                    <tr>
                        {optionNumberList.map(((value, index) =>
                            <td key = {value}
                                className={SudokuPaneStyle.editBarItem}
                                onClick={()=>(onOptionNumberClickHandler(value))}>
                                {value}
                            </td>))}
                            <td key = {0}
                                className={SudokuPaneStyle.editBarItem}
                                onClick={()=>(onOptionNumberClickHandler(0))}>
                                X
                            </td>
                    </tr>
                </tbody>
            </table>
            <button onClick={changeEditMarkHandler}
                    className={`${markModel ? SudokuPaneStyle.enableMarkModel : null} 
                                ${SudokuPaneStyle.defaultButton}`}>笔记
            </button>
        </div>
    </>
    )
}

export default SudokuPane