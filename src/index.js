// Load application styles
import 'styles/index.scss';

import { Templates, APIs } from './config/Config';
import { Actions } from './definitions/Actions';

// require all of our applications core actors
// e.g. all individual controllers, services and the pubsub-js
// to setup the publish-subscribe messaging system
// to communicate state changes

import { init as SystemControllerInit } from './controllers/SystemController';
import * as FourSquareService from './services/FourSquareService';
const PubSub = require("pubsub-js");

SystemControllerInit();

// we expose the actual application bootstrap to the window Object
// as we feed sensitive configuration values from outside
// (e.g. client ID and secret for third party API's that
// shouldn't belong under version control)

window.init = ( config ) => {

    // validate whether all required properties (e.g. API keys have been specified)

    const requiredStrings = [
        "fsClientId", "fsClientSecret", "gmKey"
    ];
    let error = "";
    requiredStrings.forEach(( key ) => {
        if ( !config || typeof config[ key ] !== "string" ) {
            error += `Required configuration key "${key}" not specified`;
        }
    });

    // if there was an Error, show a message and halt execution

    if ( error.length > 0 ) {
        PubSub.publish( Actions.SHOW_ERROR, { message: error });
        return;
    }

    // no Errors \o/
    // store API configurations in configuration Object

    APIs.FOURSQUARE.clientId     = config.fsClientId;
    APIs.FOURSQUARE.clientSecret = config.fsClientSecret;

    // bootstrap and start our application
    FourSquareService.API.venue( "Poli" ).then(( data ) => console.warn(data));
};
