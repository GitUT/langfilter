import * as csv from 'fast-csv';
import * as fs from 'fs';
import * as cld from 'cld';

import {actionPrompt} from "./ui";
import * as defs from "./definitions";


const action = actionPrompt();

// Counters
let enCount = 0;
let unknownCount = 0;
let rowsWithinDates = 0;


// Printer functions
function onLangEnd(): void {
    console.log("Detected English: " + enCount);
    console.log("Unknowns: " + unknownCount);
}

function onDateEnd(): void {
    console.log("Rows within dates: " + rowsWithinDates);
}

function onEnd(): void {
    const actionMapper = {
        [defs.Action.language]: onLangEnd,
        [defs.Action.date]: onDateEnd,
    }
    actionMapper[action]();
}

const readStream = fs.createReadStream(defs.inFilePath);
const writeStream = fs.createWriteStream(defs.outFilePath);
const parser = csv.parse({headers:true, delimiter: ";"});

console.time('timer');
// Parse file
readStream.pipe(parser)
    .on('error', error => console.log(error))
    .on('end', (rowCount: number) => {
    console.log(`Parsed ${rowCount} rows`);
    onEnd();
    console.timeEnd('timer');
    })

    // Necessary for incrementing rowCount
    .on('data', (row) => {})

    // Format row
    .pipe(csv.format<RowType, RowType>({
    headers: ['id','user','fullname','url','timestamp','replies','likes','retweets','text'],
    delimiter: ";",
    }))

    // Transform row
    .transform((row) => {
        const date = new Date(row.timestamp.substr(0,19) + ".001Z");
        if (date > startDate && date < endDate) {
            ++rowsWithinDates;
            return row;
        } else {
            return null;
        }
    })

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



