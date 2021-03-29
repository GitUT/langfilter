import * as csv from 'fast-csv';
import * as fs from 'fs';

console.log("start");
console.time('time');
fs.createReadStream(__dirname+"/../tweets.csv")
    .pipe(csv.parse({headers:true, delimiter: ";"}))
    .on('error', error => console.error(error))
    .on('data', row => console.log(row))
    .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));

console.timeEnd('time');
console.log("end");
