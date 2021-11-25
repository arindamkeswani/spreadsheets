let copyBtn = document.querySelector(".copy")
let cutBtn = document.querySelector(".cut")
let pasteBtn = document.querySelector(".paste")

//this var will store whether ctrl key is pressed or not (true or false)
let ctrlKey = false;

//check if key pressed in ctrl key
document.addEventListener("keydown", (e) => {
    ctrlKey = e.ctrlKey; //will give boolean value
})

//check if key un-pressed in ctrl key
document.addEventListener("keyup", (e) => {
    ctrlKey = e.ctrlKey;
})

//add listener to all cells to check for selection
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < column; j++) {
        let cell = document.querySelector(`.cells[rid = "${i}"][cid = "${j}"]`);
        handleSelectedCells(cell);
    }
}

let rangeStorage = [];
let rowDiff = 0;
let colDiff = 0;
function handleSelectedCells(cell) {
    cell.addEventListener("click", (e) => {
        //Select range of cells
        //will need a storage to keep track of selected cells
        if (!ctrlKey) {


            for (let i = rangeStorage.length - 1; i >= 0; i--) {
                let prevCell = document.querySelector(`.cells[rid = "${rangeStorage[i][0]}"][cid = "${rangeStorage[i][1]}"]`);
                prevCell.style.border = "1px solid #dfe4ea"

                rangeStorage.pop();
            }


            cell.style.border = "1px solid #dfe4ea"
            console.log(rangeStorage);
            return;
        }

        //range cannot exceed 2 indexes (one for top-left, other for bottom right)
        if (rangeStorage.length == 2) {
            let prevCell = document.querySelector(`.cells[rid = "${rangeStorage[1][0]}"][cid = "${rangeStorage[1][1]}"]`);
            prevCell.style.border = "1px solid #dfe4ea"

            // rangeStorage.pop();

            cell.style.border = "3px solid #218c74"
            let rid = Number(cell.getAttribute("rid"));
            let cid = Number(cell.getAttribute("cid"));
            rangeStorage[1][0] = rid;
            rangeStorage[1][1] = cid;

            console.log(rangeStorage[0], rangeStorage[1]);
            rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0])
            colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1])

            return;


        }

        //UI
        cell.style.border = "3px solid #218c74"

        //get rid and cid or ctrl+clicked cell
        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid, cid]);
        console.log(rangeStorage);

        if (rangeStorage.length == 2) {
            rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0])
            colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1])
        }

    })
}

//to store copied data
let clipboard = []
copyBtn.addEventListener("click", (e) => {
    clipboard=[];
    let srow = rangeStorage[0][0];
    let erow = rangeStorage[1][0];
    let scol = rangeStorage[0][1];
    let ecol = rangeStorage[1][1];

    for (let i = Math.min(srow, erow); i <= Math.max(srow, erow); i++) {
        let copyRow = []
        for (let j = Math.min(scol, ecol); j <= Math.max(scol, ecol); j++) {
            let cellProp = sheetDB[i][j];
            copyRow.push(cellProp)
        }
        clipboard.push(copyRow);
    }

    for (let i = rangeStorage.length - 1; i >= 0; i--) {
        let prevCell = document.querySelector(`.cells[rid = "${rangeStorage[i][0]}"][cid = "${rangeStorage[i][1]}"]`);
        prevCell.style.border = "1px solid #dfe4ea";
    }

    console.log(clipboard);

})


pasteBtn.addEventListener("click", (e) => {
    console.log("Paste clicked");
    // if (rangeStorage.length != 2) return;

    // let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0])
    // let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1])

    let address = addressbar.value;
    let [tarStartRow, tarStartCol] = decoderidcid(address)
    console.log(tarStartRow, tarStartCol);
    //clipRow -> refer copy row
    //clipCol -> refer copy column
    for (let i = tarStartRow, clipRow = 0; i <= tarStartRow + rowDiff; i++, clipRow++) {
        for (let j = tarStartCol, clipCol = 0; j <= tarStartCol + colDiff; j++, clipCol++) {
            let cell = document.querySelector(`.cells[rid = "${i}"][cid = "${j}"]`);
            if (!cell) {
                alert("Going out of spreadsheet's range.")
                continue;
            }

            let copiedCellProp = clipboard[clipRow][clipCol]

            let cellProp = sheetDB[i][j];

            //Update in DB
            cellProp.bold = copiedCellProp.bold;
            cellProp.italic = copiedCellProp.italic;
            cellProp.underline = copiedCellProp.underline;
            cellProp.alignment = copiedCellProp.alignment;
            cellProp.fontColor = copiedCellProp.fontColor;
            cellProp.BGcolor = copiedCellProp.BGcolor;
            cellProp.fontFamily = copiedCellProp.fontFamily;
            cellProp.fontSize = copiedCellProp.fontSize;
            cellProp.value = copiedCellProp.value;

            //UI
            cell.click();

        }
    }
})

cutBtn.addEventListener("click", (e)=>{
    // clipboard=[];
    let srow = rangeStorage[0][0];
    let erow = rangeStorage[1][0];
    let scol = rangeStorage[0][1];
    let ecol = rangeStorage[1][1];

    for (let i = Math.min(srow, erow); i <= Math.max(srow, erow); i++) {
        
        for (let j = Math.min(scol, ecol); j <= Math.max(scol, ecol); j++) {
            let cellProp = sheetDB[i][j];

            let cell = document.querySelector(`.cells[rid = "${i}"][cid = "${j}"]`);

            //DB
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.alignment = "left";
            cellProp.fontColor = "#000000";
            cellProp.BGcolor = "#000000"
            cellProp.fontFamily = "monospace";
            cellProp.fontSize = 14;
            cellProp.value = "";

            //UI
            cell.click()
        }
    }

    for (let i = rangeStorage.length - 1; i >= 0; i--) {
        let prevCell = document.querySelector(`.cells[rid = "${rangeStorage[i][0]}"][cid = "${rangeStorage[i][1]}"]`);
        prevCell.style.border = "1px solid #dfe4ea";
    }

    console.log(clipboard);

})