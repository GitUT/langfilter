// The available actions

export enum Action {
    language = "language",
    date = "date",
}


// Files
export const inFile = "tweets.csv";
export const inFilePath = __dirname+"/../assets/" + inFile;

export const outFile = "out.csv";
export const outFilePath = __dirname+"/../assets/" + outFile;

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

// Dates
export const date1 = new Date('2017-11-01 00:00:00.000Z');
export const date2 = new Date('2017-12-16 23:59:59.999Z');
export const date3 = new Date('2017-12-17 00:00:00.000Z');
export const date4 = new Date('2018-01-20 23:59:59.999Z');
export const startDate = date1;
export const endDate = date2;
