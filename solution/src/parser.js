const fs = require('fs');
const XLSX = require('xlsx')

const parse = (filename) => {
    const excelData = XLSX.readFile(filename);

    return Object.keys(excelData.Sheets).map((name) => ({
        name,
        data: XLSX.utils.sheet_to_json(excelData.Sheets[name]),
    }));
};



// console.log(dataFromExcel);

let dataFromExcel = new Array;
parse("hacknu-dev-data.xlsx").forEach((e) => {
    dataFromExcel.push(e.data);
});


// console.log(typeof(dataFromExcel));
let res = JSON.stringify(dataFromExcel)
// console.log(res);
fs.writeFile("results.json", res, (err,result)=>{
    if(err) console.log("error", err);
})