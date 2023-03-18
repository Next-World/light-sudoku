import React from 'react';
import MarkEditItemStyle from './MarkEditItem.module.scss'

interface MarkProp {
    markValues : number[]
}

function MarkEditItem(props : MarkProp){
    //const initialData : string[][] = [["1","2","3"],["4","5","6"],["7","8","9"]]
    const makeInitialMapValue = (markValues : number[]) =>{
        // console.log("mark=>" + markValues)
        let ans: number[][] = new Array(3)
        for(let i = 0; i < 3; i++){
            ans[i] = markValues.slice(i * 3, i * 3 + 3);
        }
        return ans
    }

    return <>
        <div className={MarkEditItemStyle.container}>
            <table style={{borderCollapse:"collapse",width:"100%"}}>
                <tbody>
                {makeInitialMapValue(props.markValues).map((rowValue, row) =>
                    <tr key={row}>
                        {rowValue.map((colValue, col) =>
                            <td key={row + col} className={MarkEditItemStyle.markItem}>
                                {colValue === 0 ? " " :colValue}
                            </td> )}
                    </tr>)}
                </tbody>
            </table>

        </div>
    </>
}

export default MarkEditItem