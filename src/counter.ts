// Counter
export default class Counter {
    private _enCount = 0;
    private _unknownCount = 0;
    private _rowsWithinDates = 0;
    private _hashtags: {[hashtag: string]: number} = {};

    // Getters
    get enCount(): number {
        return this._enCount;
    }

    get unknownCount(): number {
        return this._unknownCount;
    }

    get rowsWithinDates(): number {
        return this._rowsWithinDates;
    }

    get hashtagCount(): {[hashtag: string]: number} {
        return this._hashtags;
    }

    // Incrementers
    incrementEnCount() {
        ++this._enCount;
    }

    incrementUnknownCount() {
        ++this._unknownCount;
    }

    incrementRowsWithinDates() {
        ++this._rowsWithinDates;
    }

    incrementHashTagCount(hashtag: string) {
        if (hashtag in this._hashtags) {
            ++this._hashtags[hashtag];
        } else {
            this._hashtags[hashtag] = 0;
        }
    }
}
