let collectedSheetDB =[]
let sheetDB = [];

{
    let addSheetButton = document.querySelector(".sheet-add-icon");
    addSheetButton.click();
    // handleSheetProps();
}
// for (let i = 0; i < rows; i++) {
//     let sheetRow = [];
//     for (let j = 0; j < column; j++) {
//         let cellProp = {
//             bold: false,
//             italic: false,
//             underline: false,
//             alignment: "left",
//             fontColor: "#000000",
//             BGcolor: "#000000",
//             fontFamily: "monospace",
//             fontSize: "14",
//             value: "",
//             formula: "",
//             children:[]
//         }
//         sheetRow.push(cellProp);

//     }
//     sheetDB.push(sheetRow);

// }

//get the reference of properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGcolor = document.querySelector(".BGcolor-prop");
let alignment = document.querySelectorAll(".alignment");

let leftAlign = alignment[0];

let rightAlign = alignment[1];

let centerAlign = alignment[2];






let activecolorprop = "#d1d8e0";
let inactivecolorprop = "#ecf0f1";




//attach event listener to it
bold.addEventListener("click", (e) => {
    let address = addressbar.value;
    let [cell, cellProp] = activecell(address);
    //Modification
    cellProp.bold = !cellProp.bold; //storage
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; //UI Part 1
    bold.style.backgroundColor = cellProp.bold ? activecolorprop : inactivecolorprop; //UI part 2
})


italic.addEventListener("click", (e) => {
    let address = addressbar.value;
    let [cell, cellProp] = activecell(address);
    //Modification
    cellProp.italic = !cellProp.italic; //storage
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; //UI Part 1
    italic.style.backgroundColor = cellProp.italic ? activecolorprop : inactivecolorprop; //UI part 2
})


underline.addEventListener("click", (e) => {
    let address = addressbar.value;
    let [cell, cellProp] = activecell(address);
    //Modification
    cellProp.underline = !cellProp.underline; //storage
    cell.style.textDecoration = cellProp.underline ? "underline" : "none"; //UI Part 1
    underline.style.backgroundColor = cellProp.underline ? activecolorprop : inactivecolorprop; //UI part 2
})

fontSize.addEventListener("change", (e) => {
    let address = addressbar.value;
    let [cell, cellProp] = activecell(address);

    cellProp.fontSize = fontSize.value;
    cell.style.fontSize = cellProp.fontSize + "px";
    fontSize.value = cellProp.fontSize;
})

fontFamily.addEventListener("change", (e) => {
    let address = addressbar.value;
    let [cell, cellProp] = activecell(address);

    cellProp.fontFamily = fontFamily.value;
    cell.style.fontFamily = cellProp.fontFamily;
    fontFamily.value = cellProp.fontFamily;
})

fontColor.addEventListener("change", (e) => {
    let address = addressbar.value;
    let [cell, cellProp] = activecell(address);

    cellProp.fontColor = fontColor.value;
    cell.style.color = cellProp.fontColor;
    fontColor.value = cellProp.fontColor;
})



BGcolor.addEventListener("change", (e) => {
    let address = addressbar.value;
    let [cell, cellProp] = activecell(address);

    cellProp.BGcolor = BGcolor.value;
    cell.style.backgroundColor = cellProp.BGcolor;
    BGcolor.value = cellProp.BGcolor;
})

alignment.forEach((alignElem) => {
    alignElem.addEventListener("click", (e) => {
        let address = addressbar.value;
        let [cell, cellProp] = activecell(address);

        let alignvalue = e.target.classList[0];
        cellProp.alignment = alignvalue; //storage
        cell.style.textAlign = cellProp.alignment;//UI part 1

        switch (alignvalue) {
            case "left":
                leftAlign.style.backgroundColor = activecolorprop;
                rightAlign.style.backgroundColor = inactivecolorprop;
                centerAlign.style.backgroundColor = inactivecolorprop;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactivecolorprop;
                rightAlign.style.backgroundColor = activecolorprop;
                centerAlign.style.backgroundColor = inactivecolorprop;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactivecolorprop;
                rightAlign.style.backgroundColor = inactivecolorprop;
                centerAlign.style.backgroundColor = activecolorprop;
                break;
        }


    })
})

let allcells = document.querySelectorAll(".cells");
for (let i = 0; i < allcells.length; i++) {
    addingeventlistener(allcells[i]);
}
function addingeventlistener(cell) {
    cell.addEventListener("click", (e) => {
        //Task Area
        let address = addressbar.value;
        let [rid, cid] = decoderidcid(address);
        // console.log(rid, cid);
        // console.log(sheetDB[rid][cid]);
        let cellProp = sheetDB[rid][cid];

        //TASK AT CELL
        //    console.log(sheetDB);
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.BGcolor === "#000000" ? "transparent" : cellProp.BGcolor;
        cell.style.textAlign = cellProp.alignment;


        //TASK AT PROPERTY BAR
        bold.style.backgroundColor = cellProp.bold ? activecolorprop : inactivecolorprop;
        italic.style.backgroundColor = cellProp.italic ? activecolorprop : inactivecolorprop;
        underline.style.backgroundColor = cellProp.underline ? activecolorprop : inactivecolorprop;
        fontSize.value = cellProp.fontSize;
        fontFamily.value = cellProp.fontFamily;
        fontColor.value = cellProp.fontColor;
        BGcolor.value = cellProp.BGcolor;
        switch (cellProp.alignment) {
            case "left":
                leftAlign.style.backgroundColor = activecolorprop;
                centerAlign.style.backgroundColor = inactivecolorprop;
                rightAlign.style.backgroundColor = inactivecolorprop;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactivecolorprop;
                rightAlign.style.backgroundColor = activecolorprop;
                centerAlign.style.backgroundColor = inactivecolorprop;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactivecolorprop;
                rightAlign.style.backgroundColor = inactivecolorprop;
                centerAlign.style.backgroundColor = activecolorprop;
                break;
        }

        let formulaBar = document.querySelector(".formula-bar");
        formulaBar.value = cellProp.formula
        cell.innerText = cellProp.value

    })
}

//storage as well as UI
function activecell(address) {
    let [rid, cid] = decoderidcid(address);
    let cell = document.querySelector(`.cells[rid = "${rid}"][cid = "${cid}"]`);
    let cellProp = sheetDB[rid][cid];
    return [cell, cellProp];

}


function decoderidcid(address)//A1
{   
    // console.log(address);
    let rid = Number(address.slice(1)) - 1; //"1" -> 0
    let cid = Number(address.charCodeAt(0)) - 65; //"A" - >0
    return [rid, cid];

}