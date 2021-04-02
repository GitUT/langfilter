import * as csv from 'fast-csv';
import * as fs from 'fs';
import * as cld from 'cld';

import * as ui from "./ui";
import * as defs from "./definitions";
import Counter from "./counter";


const action = ui.actionPrompt();
const counter = new Counter();

const readStream = fs.createReadStream(defs.inFilePath);
const writeStream = fs.createWriteStream(defs.outFilePath);
const parseOptions = {headers: true, delimiter: ";"};
const parser = csv.parse(parseOptions);

console.time('timer');

// Parse file
readStream.pipe(parser)
    .on('error', error => ui.error(error))
    .on('end', (rowCount: number) => {
    ui.message(`Parsed ${rowCount} rows`);
    ui.onEnd(action, counter);
    ui.message('timer');
    })

    // Necessary for incrementing rowCount
    .on('data', (row) => {})

    // Format row
    .pipe(csv.format<defs.RowType, defs.RowType>(parseOptions))

    // Transform row
    .transform((row) => {
        const date = new Date(row.timestamp.substr(0,19) + ".001Z");
        if (date > defs.startDate && date < defs.endDate) {
            counter.incrementRowsWithinDates();
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



