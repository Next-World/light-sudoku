import React, {useEffect, useState} from 'react';
import SudokuPaneStyle from './SudokuPane.module.scss'
import MarkEditItem from "../MarkEditItem";
import type {Location,EditMark} from "./SudokuPane";
import {checkSudokuIsValid, resolveSudoku, strToDataArray} from '../../utils/sudokuUtil'

interface GetCurrentGridDataFunction {
    (s : string[][]):void
}


interface SudokuPaneInitProps{
    initialGridData? : string[][],
    getCurrentGridData? : GetCurrentGridDataFunction
}

function SudokuPane(props : SudokuPaneInitProps){
    const optionNumberList : number[] = Array.from({length:9},(x,i)=>i + 1)

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
    const tempInitialGridData :string[][] = props.initialGridData !== undefined ? props.initialGridData : strToDataArray(sourceStr)

    // 初始化的数独
    const [initialGridData,setInitialGridData] = useState<string[][]>(tempInitialGridData)

    // 当前选中的位置
    const initLocation : Location = {row : -1,col : -1, currentValue : -1}
    const [selectLocation,setSelectLocation] = useState<Location>(initLocation)

    // 当前编辑的数独
    const [editGridData,setEditGridData] = useState<string[][]>(initialGridData)

    // 警告的列表
    const initialWarmingList : Location[] = []
    const [warmingList,setWarmingList] = useState<Location[]>(initialWarmingList)

    // 是否标记模式
    const [markModel,setMarkModel] = useState<boolean>(false)

    // 标记模式的标记
    const initialEditMarks : EditMark[][] = InitEditMarks()
    const [editMarks,setEditMarks] = useState<EditMark[][]>(initialEditMarks)

    // 是否开启标记模式
    const [editModel,setEditModel]  = useState<boolean>(false)

    useEffect(()=>{
       let newWarmingList =  checkSudokuIsValid(editGridData);
       setWarmingList(newWarmingList)
    },[editGridData])

    // 点击棋盘时更新位置
    const onItemClickHandler = (col : number, row : number, value : string) => {
        console.log("col = " + col + ",row = "  + row)
        const currentValue : number = value === "0" ? -1 : parseInt(value)
        const selectLocation : Location = {col,row,currentValue}
        setSelectLocation(selectLocation)
    }

    // 清除当前选择格子的标记
    const clearCurrentMark = () => {
        setEditMarks((prevState)=>{
            const currentRow = selectLocation.row;
            const currentCol = selectLocation.col;
            if(currentRow === -1 || currentCol === -1){
                return prevState
            }

            let newEditMarks : EditMark[][] = [...prevState]

            let editMarkItem : EditMark = [...prevState[currentRow][currentCol]]
            editMarkItem.fill(0)
            newEditMarks[currentRow] = [...prevState[currentRow]]
            newEditMarks[currentRow][currentCol] = [...editMarkItem]
            return newEditMarks
        })
    }

    // 选择填充的数字
    const onOptionNumberClickHandler = (value : number) => {
        console.log("onclick value = " + value);

        //标记模式
        if(markModel && !editModel){
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
            if(prevEditGridData[currentRow][currentCol] === value.toString()){
                value = 0;
            }
            newGridData[currentRow] = [...prevEditGridData[currentRow]]
            newGridData[currentRow][currentCol] = value.toString();
            console.log(newGridData[currentRow][currentCol])
            return newGridData
        }))

        //清空标记
        clearCurrentMark()

        setSelectLocation((prevstate)=>{
            return {...prevstate,currentValue: value}
        })
    }

    // 检查是否应该提出警告
    const checkIfInWarmingList = (row : number, col : number) =>{
        for(let i in warmingList){
            if(row === warmingList[i].row && col === warmingList[i].col){
                return true
            }
        }
        return false;
    }

    // 更改标记模式
    const changeEditMarkHandler = () =>{
        const newMarkModel : boolean = !markModel;
        setMarkModel(newMarkModel)
    }

    // 更改编辑模式，用于手动导入数独的
    const changeEditModelHandler = (newEditModel : boolean) =>{
        setEditModel(newEditModel)
        // 进入编辑模式，就把所有数据清空
        if(newEditModel){
            //清空标记
            clearCurrentMark()

            //初始化数组清空
            let newInitialGridData : string[][]  = []
            for(let i = 0; i < initialGridData.length; i++){
                newInitialGridData[i] = Array.from({length:9},()=>"0")
                setInitialGridData(newInitialGridData)
            }
            let newEditGridData : string[][] = [];
            for(let i = 0; i < editGridData.length; i++){
                newEditGridData[i] = Array.from({length:9},()=>"0")
            }
            setEditGridData(newEditGridData)
        } else {
            // 结束编辑模式，把当前编辑内容保存
            let newInitialGridData : string[][] = [];
            for(let i = 0; i < initialGridData.length; i++){
                newInitialGridData[i] = Array.from({length : 9},()=>"0")
                for(let j = 0; j < initialGridData[i].length; j++){
                    newInitialGridData[i][j] = editGridData[i][j];
                }
            }
            setInitialGridData(newInitialGridData)
        }

    }
    // 解决数独
    const handlerResolveSudoku = ()=>{
        let errLocation = checkSudokuIsValid(editGridData)
        if(errLocation.length !== 0){
            alert("该数独无法解决")
            return;
        }
        let newEditGridData = [...editGridData]
        for(let i = 0; i < editGridData.length; i++){
            newEditGridData[i] = [...editGridData[i]]
        }
        let canResolve = resolveSudoku(newEditGridData);
        if(!canResolve){
            alert("该数独无法解决")
            return;
        }
        setEditGridData(newEditGridData)
    }

    // 恢复数独
    const recoverSudoku = ()=>{
        let newEditGridData = [...initialGridData]
        for(let i = 0; i < initialGridData.length; i++){
            newEditGridData[i] = [...initialGridData[i]]
        }
        setEditGridData(newEditGridData)
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
                                                ${(row === selectLocation.row && col === selectLocation.col) || 
                                                    (value === selectLocation.currentValue.toString() && selectLocation.currentValue !== 0)
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
        <div className={SudokuPaneStyle.editContainer}>
            <div className={SudokuPaneStyle.editOptionContainer}>
                <button onClick={changeEditMarkHandler}
                        className={`${markModel ? SudokuPaneStyle.enableMarkModel : null} 
                            ${SudokuPaneStyle.defaultButton}`}
                        disabled={editModel}
                >
                    笔记
                </button>
                <button className={`${SudokuPaneStyle.defaultButton}
                                    ${editModel ? SudokuPaneStyle.enableEditModel : null}`}
                        onClick={()=>{changeEditModelHandler(!editModel)}}
                >
                    编辑模式
                </button>
                <button
                    className={`${SudokuPaneStyle.defaultButton}`}
                    onClick={()=>{handlerResolveSudoku()}}
                >
                    解决
                </button>
                <button
                    className={`${SudokuPaneStyle.defaultButton}`}
                    onClick={()=>{recoverSudoku()}}
                >
                    恢复
                </button>
            </div>
            <table>
                <tbody>
                    <tr>
                        {optionNumberList.map(((value, index) =>
                            <td key = {value}
                                className={`${SudokuPaneStyle.editNumberItem} 
                                ${(selectLocation.currentValue === value && 
                                    selectLocation.row !== -1 && selectLocation.col !== -1 &&
                                    initialGridData[selectLocation.row][selectLocation.col] === "0") ?
                                    SudokuPaneStyle.editNumberItemSelect : null}`}
                                onClick={()=>(onOptionNumberClickHandler(value))}>
                                {value}
                            </td>))}
                            <td key = {0}
                                className={SudokuPaneStyle.editNumberItem}
                                onClick={()=>(onOptionNumberClickHandler(0))}>
                                X
                            </td>
                    </tr>
                </tbody>
            </table>

        </div>
    </>
    )
}

export default SudokuPane