import * as FourSquareService from '../services/FourSquareService';
import { Actions } from '../definitions/Actions';
import { Copy } from '../definitions/Copy';
import { Locations } from '../definitions/Enums';
const PubSub = require("pubsub-js");

/* variables */

let container, wrapper;

export function init() {

    // subscribe to messages indicating we should show some feedback to the user

    [
        Actions.FLUSH_ALL_MARKERS

    ].forEach(( message ) => PubSub.subscribe( message, handleBroadcast ));

    // let's get crackin' with that FourSquare API

    updateWorld();

    // show friendly welcome message stating what this pile of code is about.

    PubSub.publish( Actions.SHOW_FEEDBACK, { title: Copy.INTRO.title, message: Copy.INTRO.message });
}

/* internal methods */

function handleBroadcast( message, payload ){

    switch ( message ) {

    }
}

/**
 * for our quaint little game, "populating the world" means that
 * we fetch all Police stations and Banks within the Players available
 * vicinity (e.g. radius) and broadcast a request to render Markers
 * from the GoogleMapsService
 */
function updateWorld() {
    let police, banks;

    // retrieve police stations

    FourSquareService.API.venue( Locations.POLICE )
        .then(( policeData ) => {
            police = policeData.venues;
            FourSquareService.API.venue( Locations.BANK )
                .then(( bankData ) => {
                    banks = bankData.venues;

                    // flush existing markers and render the new list
                    // not entirely low on overhead with regards to reusable
                    // resource, but we're in a rush ;)

                    PubSub.publish( Actions.FLUSH_MARKERS );
                    PubSub.publish( Actions.CREATE_MARKERS, { police, banks });
                })
        })
        .catch(( error ) => PubSub.publish( Actions.SHOW_ERROR, { message: error }));
}
