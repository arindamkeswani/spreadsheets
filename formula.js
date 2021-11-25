for (let i = 0; i < rows; i++) {
    for (let j = 0; j < column; j++) {
        let cell = document.querySelector(`.cells[rid = "${i}"][cid = "${j}"]`);
        cell.addEventListener("blur", (e) => {

            let address = addressbar.value;
            let [cell, cellProp] = activecell(address);
            let enteredval = cell.innerText;

            if(enteredval === cellProp.value) return;

            cellProp.value = enteredval;
            // console.log(cellProp);

            //remove children down the chain and remove formula
            removeChildFromParent(cellProp.formula)
            cellProp.formula = ""
            
            updateChildrenCells(address) //If data is modified, update children with new modifed value
        })
    }
}

let formulabar = document.querySelector(".formula-bar");
formulabar.addEventListener("keydown", async (e) => {
    let inputformula = formulabar.value;
    if (e.key === "Enter" && inputformula) {
        let address = addressbar.value
        let [cell, cellProp] = activecell(address)
        //If the formula has been changed, break parent child relationship, evaluate new formula, add new P-C relationship
        if (inputformula != cellProp.formula) {
            removeChildFromParent(cellProp.formula)
        }

        addChildToGraphComponent(inputformula, address)
        //check if formula is cyclic or not. Then evaluate, if valid

        // console.log(graphComponentMatrix)
        let isCyclic = isGraphCyclic(graphComponentMatrix)
            // console.log(isCyclic);
        if(isCyclic){
            // alert("Your formula has cyclic dependencies")
            let response = confirm("Your path has cyclic dependencies. Do you wish to trace the path?")
            while(response === true){
                //keep on tracking colour
                await isGraphCyclicTracePath(graphComponentMatrix, isCyclic) //complete full color tracking, then ask. Attach wait
                response = confirm("Your path has cyclic dependencies. Do you wish to trace the path?")
            }
            removeChildFromGraph(inputformula, address);
            return;
        }

        let evaluatedval = evaluateformula(inputformula);
        
        setuivalAndcellprop(evaluatedval, inputformula,address);

        addChildToParent(inputformula)
        // console.log(sheetDB);

        updateChildrenCells(address)
    }

})

function addChildToGraphComponent(formula, childAddress){
    //decode child details
    let [crid,ccid] = decoderidcid(childAddress);

    //decode parent details, go through formula
    let encodedformula = formula.split(" ");
    for(let i=0; i<encodedformula.length;i++ ){
        let ascii = encodedformula[i].charCodeAt(0);
        if(ascii >= 65 && ascii <=90){
            let [prid, pcid] = decoderidcid(encodedformula[i]);
            //insert child in 2D matrix
            // console.log(graphComponentMatrix[prid][pcid], crid, ccid);
            graphComponentMatrix[prid][pcid].push([crid, ccid]);
        }
    }
}

function removeChildFromGraph(formula, childAddress){
    let [crid,ccid] = decoderidcid(childAddress);

    //decode parent details, go through formula
    let encodedformula = formula.split(" ");
    for(let i=0; i<encodedformula.length;i++ ){
        let ascii = encodedformula[i].charCodeAt(0);
        if(ascii >= 65 && ascii <=90){
            let [prid, pcid] = decoderidcid(encodedformula[i]);
            //remove child from 2D matrix
            graphComponentMatrix[prid][pcid].pop();
        }
    }


}

function updateChildrenCells(parentAddress){
    let [parentCell, parentCellProp] = activecell(parentAddress);
    let children = parentCellProp.children;

    for(let i=0; i<children.length; i++){
        let childAddress = children[i];
        let [childCell, childCellProp] = activecell(childAddress);
        let childFormula = childCellProp.formula

        let evaluatedVal = evaluateformula(childFormula)
        setuivalAndcellprop(evaluatedVal, childFormula, childAddress)
        updateChildrenCells(childAddress)
    }
}

function addChildToParent(formula) {
    let childAddress = addressbar.value
    let encodedformula = formula.split(" ");
    for (let i = 0; i < encodedformula.length; i++) {
        let ascii = encodedformula[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let [parentCell, parentCellProp] = activecell(encodedformula[i]);
            console.log(childAddress);
            parentCellProp.children.push(childAddress);
            console.log(parentCellProp);
        }
    }
}

function removeChildFromParent(formula) {
    let childAddress = addressbar.value
    let encodedformula = formula.split(" ");
    for (let i = 0; i < encodedformula.length; i++) {
        let ascii = encodedformula[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let [parentCell, parentCellProp] = activecell(encodedformula[i]);
            let idx = parentCellProp.children.indexOf(childAddress)
            parentCellProp.children.splice(idx,1) //to remove child from array
        }
    }
}

function evaluateformula(formula) {
    let encodedformula = formula.split(" ");
    for (let i = 0; i < encodedformula.length; i++) {
        let ascii = encodedformula[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let [cell, cellprop] = activecell(encodedformula[i]);
            encodedformula[i] = cellprop.value;

        }

    }
    let decodedformula = encodedformula.join(" ");


    return eval(decodedformula);
}

function setuivalAndcellprop(evaluatedval, inputformula, address) {
    // let address = addressbar.value;
    let [cell, cellprop] = activecell(address)

    //UI part
    cell.innerText = evaluatedval;
    //storage part
    cellprop.value = evaluatedval;
    cellprop.formula = inputformula;

}