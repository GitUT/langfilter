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

function hashFinder(tweet: string): string[] {
    return ["fasafas","fafewfhe"];
}

function rowTransformer() {
    function onLanguage(row: defs.RowType, cb) {
        cld.detect(row.text, (err, result) => {
            if (result) {
                let code = result.languages[0].code;
                if (code == 'en') {
                    counter.incrementEnCount();
                } else {
                    row = null;
                }
            } else {
                counter.incrementUnknownCount();
                row = null;
            }
            cb(null, row);
        });
    }

    function onDate(row: defs.RowType, cb) {
        const date = new Date(row.timestamp.substr(0,19) + ".001Z");
        if (date > defs.startDate && date < defs.endDate) {
            counter.incrementRowsWithinDates();
            cb(null, row);
        } else {
            cb(null, null);
        }
    }

    function onHashtags(row: defs.RowType, cb) {
        const hashtags = hashFinder(row.text);
        for (let hashtag of hashtags) {
            counter.incrementHashTagCount(hashtag);
        }
            cb(null, null);
    }

    const transformerMapper = {
        [defs.Action.language]: onLanguage,
        [defs.Action.date]: onDate,
        [defs.Action.hashtags]: onHashtags,
    }

    return transformerMapper[action];
}

function piper() {
    function onCount() {
        // Parse file
        readStream.pipe(parser)
            .on('error', error => ui.error(error))
            .on('end', (rowCount: number) => {
                ui.onEnd(action, counter, rowCount);
            })

            // Necessary for incrementing rowCount
            .on('data', (row) => {});
    }

    function onTransform() {
        // Parse file
        readStream.pipe(parser)
            .on('error', error => ui.error(error))
            .on('end', (rowCount: number) => {
                ui.onEnd(action, counter, rowCount);
            })

            // Necessary for incrementing rowCount
            .on('data', (row) => {})

            // Format row
            .pipe(csv.format<defs.RowType, defs.RowType>(parseOptions))

            // Transform row
            .transform(rowTransformer())
            // Write to file
            .pipe(writeStream);
    }

    function onHashtags() {
        // Parse file
        readStream.pipe(parser)
            .on('error', error => ui.error(error))
            .on('end', (rowCount: number) => {
                ui.onEnd(action, counter, rowCount);
            })

            // Necessary for incrementing rowCount
            .on('data', (row) => {})

            // Format row
            .pipe(csv.format<defs.RowType, defs.RowType>(parseOptions))

            // Transform row
            .transform(rowTransformer())
            // Write to file
            .pipe(writeStream);
    }

    const piperMapper = {
        [defs.Action.count]: onCount,
        [defs.Action.language]: onTransform,
        [defs.Action.date]: onTransform,
        [defs.Action.hashtags]: onHashtags
    }

    piperMapper[action]();
}

console.time('timer');
piper();
