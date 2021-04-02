import * as promptMaker from 'prompt-sync';

import * as defs from "./definitions";
import Counter from "./counter";


const prompter = promptMaker();

export function actionPrompt(): defs.Action {
    message("Choose from actions: language, date: ");
    const action: string = prompter("> ");
    if (!(action in defs.Action)) {
        message("Unknown action. Exiting program");
        process.exit(0);
    }

    message("Executing action: " + action);
    return action as defs.Action;
}

// Printer function
export function onEnd(action: defs.Action, counter: Counter): void {
    function onLanguage(): void {
        message("Detected English: " + counter.enCount);
        message("Unknowns: " + counter.unknownCount);
    }

    function onDate(): void {
        message("Rows within dates: " + counter.rowsWithinDates);
    }

    const actionMapper = {
        [defs.Action.language]: onLanguage,
        [defs.Action.date]: onDate,
    }
    actionMapper[action]();
}

export function message(message: string) {
    console.log(message);
}
export function error(error: Error) {
    console.log(error);
}
