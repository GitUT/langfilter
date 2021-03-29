import * as csv from 'fast-csv';
import * as fs from 'fs';

const filename = "test.csv";
const filepath = __dirname+"/../" + filename;

console.log("start");
console.time('time');
fs.createReadStream(filepath)
    .pipe(csv.parse({headers:true, delimiter: ";", maxRows: 10}))
    .on('error', error => console.error(error))
    .on('data', row => console.log(row))
    .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));

console.timeEnd('time');
console.log("end");
