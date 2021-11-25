let addSheetButton = document.querySelector(".sheet-add-icon");
let sheetsFolderCont = document.querySelector(".sheet-folder-cont");
activeSheetColor = "#ced6e0";

addSheetButton.addEventListener("click", (e) => {
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheet-folder")

    let allSheetFolders = document.querySelectorAll(".sheet-folder");

    sheet.setAttribute("id", allSheetFolders.length);
    sheet.innerHTML = `
    <div class="sheet-content">Sheet ${allSheetFolders.length + 1}</div>
    `

    sheetsFolderCont.appendChild(sheet);
    sheet.scrollIntoView();
    createSheetDB();
    createGraphComponentMatrix();
    handleActiveSheet(sheet);
    handleSheetRemoval(sheet)
    sheet.click()
})

function handleSheetRemoval(sheet) {
    sheet.addEventListener("mousedown", (e) => {
        // Right click
        if (e.button !== 2) return;

        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if (allSheetFolders.length === 1) {
            alert("At least 1 sheet is required.");
            return;
        }

        let response = confirm("Your sheet will be removed permanently, Are you sure?");
        if (response === false) return;

        let sheetIdx = Number(sheet.getAttribute("id"));
        // DB
        collectedSheetDB.splice(sheetIdx, 1);
        collectedGraphComponent.splice(sheetIdx, 1);
        // UI
        handleSheetUIRemoval(sheet)

        // By default DB to sheet 1 (active)
        sheetDB = collectedSheetDB[0];
        graphComponentMatrix = collectedGraphComponent[0];
        handleSheetProps();
    })
}

function handleSheetUIRemoval(sheet) {
    sheet.remove();
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0;i < allSheetFolders.length;i++) {
        allSheetFolders[i].setAttribute("id", i);
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i+1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
    }

    allSheetFolders[0].style.backgroundColor = activeSheetColor;
}


function handleSheetDB(sheetIdx){
    // console.log(sheetIdx);
    // console.log(collectedSheetDB[sheetIdx]);
    sheetDB = collectedSheetDB[sheetIdx]    
    graphComponentMatrix = collectedGraphComponent[sheetIdx];
}

function handleSheetProps(){
    for(let i=0; i<rows; i++){
        for(let j =0; j<column; j++){
            let cell = document.querySelector(`.cells[rid = "${i}"][cid = "${j}"]`);
            cell.click();
        }
    }

    let firstcell = document.querySelector(".cells");
    firstcell.click();
}

function handleSheetUI(sheet){
    let allSheetFolders =document.querySelectorAll(".sheet-folder");

    for(let i=0; i<allSheetFolders.length; i++){
        allSheetFolders[i].style.backgroundColor="transparent"
    }

    sheet.style.backgroundColor = activeSheetColor;
}

function handleActiveSheet(sheet){
    sheet.addEventListener("click", (e)=>{
        let sheetIdx = Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx); //to retrieve the attributes of cells in current sheet
        handleSheetProps();
        handleSheetUI(sheet);
    })
}

function createSheetDB() {
    let sheetDB = [];

    for (let i = 0; i < rows; i++) {
        let sheetRow = [];
        for (let j = 0; j < column; j++) {
            let cellProp = {
                bold: false,
                italic: false,
                underline: false,
                alignment: "left",
                fontColor: "#000000",
                BGcolor: "#000000",
                fontFamily: "monospace",
                fontSize: "14",
                value: "",
                formula: "",
                children: []
            }
            sheetRow.push(cellProp);

        }
        sheetDB.push(sheetRow);
    }
    collectedSheetDB.push(sheetDB);
}

function createGraphComponentMatrix() {
    graphComponentMatrix = [];

    //Get 2D representation (100x26)
    for (let i = 0; i < rows; i++) {
        let row = []
        for (let j = 0; j < column; j++) {
            //cell properties. Similar to how we put object, now we put array
            //Pushing array here because of "Can have more than 1 child relation (dependency)"
            row.push([])
        }

        //this will push all 100 rows
        graphComponentMatrix.push(row)
    }

    collectedGraphComponent.push(graphComponentMatrix)
}