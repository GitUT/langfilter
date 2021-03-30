import * as csv from 'fast-csv';
import * as fs from 'fs';
import * as cld from 'cld';

const filename = "test.csv";
const filepath = __dirname+"/../" + filename;

console.time('time');

const writeStream = fs.createWriteStream(__dirname + "/../" + "/tmp.csv");

const readStream = fs.createReadStream(filepath)

    // Parse file
    .pipe(csv.parse({headers:true, strictColumnHandling: true, delimiter: ";"}))
    .on('data-invalid',(msg) => {
        readStream.destroy();
    })
    .on('error', error => console.error(error))
    .on('end', (rowCount: number) => {
        console.log(`Parsed ${rowCount} rows`);
    })
    .on('data', async (data) => {})

    // Transform data
    .pipe(csv.format({
        headers: ['id','user','fullname','url','timestamp','replies','likes','retweets','text','language'],
        delimiter: ";",
        transform: (row) => {
            cld.detect(row.text, (err, result) => {
                row.language = result.languages[0].code;
                return row;
            });
        }
    }))

    // Write to file
    .pipe(writeStream);

console.timeEnd('time');


