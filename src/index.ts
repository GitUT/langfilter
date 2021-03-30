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
    }))
    .transform(async (row) =>
    {
        let analysis = await cld.detect(row.text);
        let langCode = analysis.languages[0].code;
        console.log(langCode);
        let returnable = {
            id: row.id,
            user: row.user,
            fullname: row.fullname,
            url: row.url,
            timestamp: row.timestamp,
            replies: row.replies,
            likes: row.likes,
            retweets: row.retweets,
            text: row.text,
            language: langCode,
        }
        console.log(returnable);
        return returnable;
    })

    // Write to file
    .pipe(writeStream);

console.timeEnd('time');


