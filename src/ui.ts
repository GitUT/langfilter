import * as promptMaker from 'prompt-sync';

import {Action} from './definitions';


const prompter = promptMaker();

export function actionPrompt(): Action {
    console.log("Choose from actions: language, date: ");
    const action: string = prompter("> ");
    if (!(action in Action)) {
        console.log("Unknown action. Exiting program");
        process.exit(0);
    }

    console.log("Executing action: " + action);
    return action as Action;
}
