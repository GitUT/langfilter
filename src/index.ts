import * as csv from 'fast-csv';
import * as fs from 'fs';
import cld from 'cld';
import twitter from 'twitter-text';

import * as ui from "./ui.js";
import * as defs from "./definitions.js";
import Counter from "./counter.js";
import {outFile} from "./definitions.js";



const action = ui.actionPrompt();
const counter = new Counter();

const readStream = fs.createReadStream(defs.inFilePath);
const writeStream = fs.createWriteStream(defs.outFilePath);
const parseOptions = {headers: true, delimiter: defs.delimiter};
const parser = csv.parse(parseOptions);

function hashFinder(tweet: string): string[] {
    return twitter.extractHashtags(tweet);
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

    const transformerMapper = {
        [defs.Action.language]: onLanguage,
        [defs.Action.date]: onDate,
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

                const sortedArray = Object.entries(counter.hashtagCount)
                    .sort(([,b],[,a]) => a-b);
                const mostUsed = sortedArray.slice(0,defs.topHashTagsToExtract);

                ui.message("Most used hashtags, written into " + outFile);
                ui.message(mostUsed);
                mostUsed.forEach((pair) => {
                    writeStream.write(pair[0] + defs.delimiter + pair[1] + '\n');
                });
            })

            // Count hashtags
            .on('data', (row) => {
                const hashtags = hashFinder(row.text);
                for (let hashtag of hashtags) {
                    counter.incrementHashTagCount(hashtag);
                }
            });
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
