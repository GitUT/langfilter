// Counter
export default class Counter {
    private _enCount = 0;
    private _unknownCount = 0;
    private _rowsWithinDates = 0;

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
}
