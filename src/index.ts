import * as csv from 'fast-csv';
import * as fs from 'fs';
import * as cld from 'cld';

const filename = "tweets.csv";
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
// console.time('time');

let enCount: number = 0;
let errCount: number = 0;


const writeStream = fs.createWriteStream(__dirname + "/../" + "/tmp.csv");

try {
    const readStream = fs.createReadStream(filepath)

        // Parse file
        .pipe(csv.parse({headers:true, strictColumnHandling: true, delimiter: ";"}))
        .on('data-invalid',(msg) => {
            readStream.destroy();
        })
        .on('error', error => console.log(error))
        .on('end', (rowCount: number) => {
            console.log(`Parsed ${rowCount} rows`);
            console.log("Detected English: " + enCount);
            console.log("Unknowns: " + errCount);
            // console.timeEnd('time');
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
                    if (code == 'en') {
                        ++enCount;
                    }
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
                    });
                }
                else {
                    ++errCount;
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
                        language: "unknown",
                    });
                    // console.log(err);
                }
            });
        })

        // Write to file
        .pipe(writeStream);
}
catch (err) {
    console.log(err);
}



