import { fileURLToPath } from 'url';
import { dirname } from 'path';


// The available actions
export enum Action {
    language = "language",
    date = "date",
    count = "count",
    hashtags = "hashtags",
}

// Files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const inFile = "tweets_17_12_2017_1_2_2018_filtered.csv";
export const inFilePath = __dirname+"/../assets/" + inFile;

export const outFile = "tweets_17_12_2017_1_2_2018_filtered_top20_hashtags.csv";
export const outFilePath = __dirname+"/../assets/" + outFile;

// Delimiter used
export const delimiter = ",";

// Row types for transformation
export type RowType = {
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

export type HashRowType = {
    hashtag: string,
    frequency: string
}

// Dates
const date1 = new Date('2017-11-01 00:00:00.000Z');
const date2 = new Date('2017-12-16 23:59:59.999Z');
const date3 = new Date('2017-12-17 00:00:00.000Z');
const date4 = new Date('2018-02-01 23:59:59.999Z');

const date5 = new Date('2018-05-10 13:37:31.000Z');
const date6 = new Date('2018-05-10 23:22:18.999Z');
export const startDate = date3;
export const endDate = date4;

// Hashtags
export const topHashTagsToExtract = 20;

