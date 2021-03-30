import * as csv from 'fast-csv';
import * as fs from 'fs';
import {Transform} from 'stream';
import * as cld from 'cld';

const filename = "test.csv";
const filepath = __dirname+"/../" + filename;


type Rowi = {
    id: string,
    user: string,
    fullname: string,
    url: string,
    timestamp: string,
    replies: string,
    likes: string,
    retweets: string,
    text: string,
    language: string

}

// class WorkerThing extends Transform {
//     _transform(chunk, encoding, cb) {
//         cld.detect(chunk, (err, result) => {
//             if (result) {
//                 let output = result.languages[0].code;
//                 cb(undefined, output);
//             }
//             else {
//                 cb(err);
//             }
//         })
//     }
// }
// const workerThing = new WorkerThing();

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
    .pipe(csv.format<Rowi, Rowi>({
        headers: ['id','user','fullname','url','timestamp','replies','likes','retweets','text','language'],
        delimiter: ";",
    }))
    .transform((row, cb) => {
        cld.detect(row.text, (err, result) => {
            if (result) {
                let code = result.languages[0].code;
                cb(null, {
                    id: row.id,
                    user: row.user,
                    fullname: row.fullname,
                    url: row.url,
                    timestamp: row.timestamp,
                    replies: row.replies,
                    likes: row.likes,
                    retweets: row.retweets,
                    text: row.text,
                    language: code,
                })
            }
        });
        // setImmediate(() => cb(null, {
        //     id: row.id,
        //     user: row.user,
        //     fullname: row.fullname,
        //     url: row.url,
        //     timestamp: row.timestamp,
        //     replies: row.replies,
        //     likes: row.likes,
        //     retweets: row.retweets,
        //     text: row.text,
        //     language: "lollero",
        // }))

        // cld.detect(row.text, (err, result) => {
        //     row.language = result.languages[0].code;
        //     return row;
        // })
    })

    // Write to file
    // .pipe(workerThing)
    .pipe(writeStream);

console.timeEnd('time');


