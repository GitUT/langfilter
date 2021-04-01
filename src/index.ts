import * as csv from 'fast-csv';
import * as fs from 'fs';
import * as cld from 'cld';

const inFile = "tweets.csv";
const inFilePath = __dirname+"/../assets/" + inFile;

const outFile = "out.csv";
const outFilePath = __dirname+"/../assets" + outFile;



type inRow = {
    id: string,
    user: string,
    fullname: string,
    url: string,
    timestamp: string,
    replies: string,
    likes: string,
    retweets: string,
    text: string,
}

type outRow = inRow & {
    language: string
};

let enCount = 0;
let unknownCount = 0;

const date1 = new Date('2017-11-01 00:00:00.000Z');
const date2 = new Date('2017-12-16 23:59:59.999Z');

const date3 = new Date('2017-12-17 00:00:00.000Z');
const date4 = new Date('2018-01-20 23:59:59.999Z');

const readStream = fs.createReadStream(inFilePath);
const writeStream = fs.createWriteStream(outFilePath);
const parser = csv.parse({headers:true, delimiter: ";"});

console.time('timer');
// Parse file
readStream.pipe(parser)
    .on('error', error => console.log(error))
    .on('end', (rowCount: number) => {
    console.log(`Parsed ${rowCount} rows`);
    console.log("Detected English: " + enCount);
    console.log("Unknowns: " + unknownCount);
    console.timeEnd('timer');
    })

    // Necessary for incrementing rowCount
    .on('data', (row) => {})

    // Format and transform row
    .pipe(csv.format<outRow, outRow>({
    headers: ['id','user','fullname','url','timestamp','replies','likes','retweets','text'],
    delimiter: ";",
    }))
    .transform((row) => {
        const date = new Date(row.timestamp.substr(0,19) + ".001Z");
        if (date > date1 && date < date2) {
            return row;
        } else {
            return null;
        }
    })

// .transform((row, cb) => {
//     const date = new Date(row.timestamp.substr(0,19) + ".001Z");
//     if (date > date1 && date < date4) {
//         cb(null, row);
//     } else {
//         cb(null, null);
//     }
// })

// .transform((row, cb) => {
//     cld.detect(row.text, (err, result) => {
//         if (result) {
//             let code = result.languages[0].code;
//             if (code == 'en') {
//                 ++enCount;
//             }
//             cb(null, {
//                 id: row.id,
//                 user: row.user,
//                 fullname: row.fullname,
//                 url: row.url,
//                 timestamp: row.timestamp,
//                 replies: row.replies,
//                 likes: row.likes,
//                 retweets: row.retweets,
//                 text: row.text,
//                 language: code,
//             });
//         }
//         else {
//             ++errCount;
//             cb(null, {
//                 id: row.id,
//                 user: row.user,
//                 fullname: row.fullname,
//                 url: row.url,
//                 timestamp: row.timestamp,
//                 replies: row.replies,
//                 likes: row.likes,
//                 retweets: row.retweets,
//                 text: row.text,
//                 language: "unknown",
//             });
//             // console.log(err);
//         }
//     });
// })
    // Write to file
    .pipe(writeStream);



