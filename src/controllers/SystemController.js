import * as TemplateService from '../services/TemplateService';
import { Templates } from '../config/Config';
import { Actions } from '../definitions/Actions';

const PubSub = require("pubsub-js");

/* variables */

let container, wrapper, confirmBtn, cancelBtn, confirmHandler;

export function init() {

    // subscribe to messages indicating we should show some feedback to the user

    [
        Actions.SHOW_FEEDBACK,
        Actions.SHOW_ERROR

    ].forEach(( message ) => PubSub.subscribe( message, handleBroadcast ));

    // get reference to DOM Elements

    container  = document.querySelector( "#feedback" );
    wrapper    = container.querySelector( ".content" );
    confirmBtn = container.querySelector( ".confirm" );
    cancelBtn  = container.querySelector( ".cancel" );

    // add event listeners

    confirmBtn.addEventListener( "click", closeDialog );
    cancelBtn.addEventListener ( "click", closeDialog );
}

/* internal methods */

function handleBroadcast( message, payload ) {

    switch ( message ) {

        // generic feedback message
        case Actions.SHOW_FEEDBACK:
            openDialog( payload.title || "Message", payload.message );
            confirmBtn.classList.remove( "hidden" );

            // grab a reference to the optional handler to be executed on confirmation

            confirmHandler = payload.optConfirm;

            // in case a confirmation handler was specified, show the cancel button
            // if there is no confirmation handler, there will simply be a button for dialog dismissal

            if ( confirmHandler )
                cancelBtn.classList.remove( "hidden" );
            else
                cancelBtn.classList.add( "hidden" );
            break;

        // everything is going wrong error message
        case Actions.SHOW_ERROR:
            openDialog( "Error", payload.message );
            // do not allow dismissal when an Error has occurred
            confirmBtn.classList.add( "hidden" );
            break;
    }
}

function openDialog( titleText, bodyText ) {
    TemplateService.inject(
        Templates.MESSAGE_DIALOG, wrapper, { title: titleText, body: bodyText }
    );
    container.classList.add( "visible" );
}

function closeDialog( e ) {
    container.classList.remove( "visible" );

    if ( e.target === confirmBtn && typeof confirmHandler === "function" )
        confirmHandler();

    confirmHandler = null;
}
