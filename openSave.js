let downloadBtn =document.querySelector(".download");
let openBtn =document.querySelector(".open");

downloadBtn.addEventListener("click", (e)=>{
    let jsonData = JSON.stringify([sheetDB, graphComponentMatrix]);
    let file = new Blob([jsonData], {type: "application/json"});

    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "SheetData.json"
    a.click();
})

openBtn.addEventListener("click", (e)=>{
    //Open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file")
    input.click();

    //get file and convert back into JSON
    input.addEventListener("change", (e)=>{
        let fr = new FileReader();
        let files = input.files;
        let fileObj = files[0];

        fr.readAsText(fileObj);
        fr.addEventListener("load", (e)=>{
            let readSheetData = JSON.parse(fr.result);

            //create new sheet with default data 
            addSheetButton.click()

            //update sheetDB and graphcomponentmatrix with uploaded data
            sheetDB= readSheetData[0]
            graphComponentMatrix = readSheetData[1]

            collectedSheetDB[collectedSheetDB.length - 1] = sheetDB
            collectedGraphComponent[collectedGraphComponent - 1] = graphComponentMatrix

            //update in UI
            handleSheetProps();
        })


    })


})