import * as TemplateService from '../services/TemplateService';
import { Templates } from '../config/Config';
import { Actions } from '../definitions/Actions';

const PubSub = require("pubsub-js");

/* variables */

let container, wrapper;

export function init() {

    // subscribe to messages indicating we should show some feedback to the user

    [
        Actions.SHOW_FEEDBACK,
        Actions.SHOW_ERROR

    ].forEach(( message ) => PubSub.subscribe( message, handleBroadcast ));

    // get reference to DOM Elements

    container = document.querySelector( "#feedback" );
    wrapper   = container.querySelector( ".content" );
}

/* internal methods */

function handleBroadcast( message, payload ) {

    switch ( message ) {

        // generic feedback message
        case Actions.SHOW_FEEDBACK:
            openDialog( payload.title || "Message", payload.message );
            break;

        // everything is going wrong error message
        case Actions.SHOW_ERROR:
            openDialog( "Error", payload.message );
            break;
    }
}

function openDialog( titleText, bodyText ) {
    TemplateService.inject(
        Templates.MESSAGE_DIALOG, wrapper, { title: titleText, body: bodyText }
    );
    container.classList.add( "visible" );
}

function closeDialog() {
    container.classList.remove( "visible" );
}
