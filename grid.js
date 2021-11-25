let rows=100;
let column = 26;

let addresscolcont = document.querySelector(".address-col-cont");
let addressrowcont = document.querySelector(".address-row-cont");
let cellscont = document.querySelector(".cells-cont");
let addressbar = document.querySelector(".address-bar");


for(let i=0; i <rows; i++)
{
    let addresscol = document.createElement("div");
    addresscol.innerText = i+1;
    addresscol.setAttribute("class" , "address-col");
    addresscolcont.appendChild(addresscol);
}

for(let i=0; i <column; i++)
{
    let addressrow = document.createElement("div");
    addressrow.innerText = String.fromCharCode( 65 + i);
    addressrow.setAttribute("class" , "address-row");
    addressrowcont.appendChild(addressrow);
}

for(let i=0;i<rows ; i++)
{
    let rowaddress = document.createElement("div");
    rowaddress.setAttribute("class", "row-address");
    for(let j=0 ; j<column ; j++)
    {
        let cell = document.createElement("div");
        cell.setAttribute("class", "cells");
        cell.setAttribute("contenteditable", "true");

        // setting attributes for recognition of storage and active cell
        cell.setAttribute("rid",i);
        cell.setAttribute("cid",j);
        cell.setAttribute("spellcheck"  ,"false");

        addressbarvalue(cell,i,j);
        rowaddress.appendChild(cell);
    }
    cellscont.appendChild(rowaddress);

}

function addressbarvalue(cell, i , j)
{
    cell.addEventListener("click", (e)=>{
       let rowid= i+1;
       let colid = String.fromCharCode(65 + j);
       addressbar.value = `${colid}${rowid}`;



    })
}

// let firstcell = document.querySelector(".cells");
// firstcell.click();


