import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
dotenv.config();


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

export const inFile = process.env.INFILE;
export const inFilePath = __dirname+"/../assets/" + inFile;

export const outFile = process.env.OUTFILE;
export const outFilePath = __dirname+"/../assets/" + outFile;

// Delimiter used
export const delimiter = process.env.DELIMITER;

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
export const startDate = new Date(process.env.STARTDATE);
export const endDate = new Date(process.env.ENDDATE);

// Hashtags
export const topHashTagsToExtract = parseInt(process.env.HASHESTOEXTRACT);

