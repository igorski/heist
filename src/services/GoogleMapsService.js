import { APIs, Styling } from '../config/Config';
import { Actions } from '../definitions/Actions';
import { Copy } from '../definitions/Copy';
import { Assets } from '../definitions/Resources';
import { Player } from '../model/Game';

const ENDPOINT = "https://maps.googleapis.com/maps/api/js";
const ScriptLoader = require( "tiny-script-loader/loadScript" );

// reference to the Google Maps API, once loaded
let Map;
let player; // reference the players Marker
const markers = []; // all other Markers on the Map (e.g. FourSquare venues)

/**
 * load the Google Maps API
 *
 * @see https://developers.google.com/maps/documentation/javascript/adding-a-google-map
 * @return {Promise}
 */
const init = () => {

    // load Maps API

    return new Promise(( resolve, reject ) => {
        ScriptLoader(

            `${ENDPOINT}?key=${APIs.GOOGLE_MAPS.key}`, () => {

                // create Google Map and by default center around Player position

                Map = new google.maps.Map( document.getElementById( "googleMap" ), {
                    zoom: 17,
                    center: {
                        lat: Player.latitude,
                        lng: Player.longitude
                    },
                    styles: Styling.MAPS,
                    mapTypeControl: true,
                    mapTypeControlOptions: {
                        mapTypeIds: [] // hides terrain switching controls
                    }
                });

                // create Player

                player = addMarker( Player.latitude, Player.longitude, () => {
                    PubSub.publish( Actions.SHOW_FEEDBACK, {
                        title: Copy.MARKERS.title, message: Copy.MARKERS.player
                    });
                }, Assets.PLAYER );


                // subscribe to the following messages

                [
                    Actions.FLUSH_ALL_MARKERS,
                    Actions.CREATE_MARKERS

                ].forEach(( message ) => PubSub.subscribe( message, handleBroadcast ));

                resolve();
            });
    });
};

const API = {

};

export { init, API };

/* internal methods */

function handleBroadcast( message, payload ) {
    switch ( message ) {

        // remove all non-Player related Markers from the Map,
        // see https://developers.google.com/maps/documentation/javascript/examples/marker-remove

        case Actions.FLUSH_ALL_MARKERS:

            while ( markers.length > 0 ) {
                const marker = markers.shift();
                // this removes the Marker from the Map, by shifting it from the
                // Array it can get garbage collected
                marker.setMap( null );
            }
            break;


        // create and render all Markers for all non-Player related content
        // (e.g. the Banks and the Police)

        case Actions.CREATE_MARKERS:

            payload.police.forEach(( police ) => {
                createMarkerFromVenue( police, Assets.POLICE );
             });
            payload.banks.forEach(( bank ) => {
                createMarkerFromVenue( bank, Assets.BANK );
            });
            break;
    }
}

/**
 * Formats a FourSquare venue data Object into a Google Maps Marker
 * and push it into the Marker list
 *
 * @see https://developer.foursquare.com/docs/api/venues/details
 *
 * @param {Object} venue
 * @param {string} iconURL
 */
function createMarkerFromVenue( venue, iconURL ) {
    markers.push( addMarker(
        venue.location.lat, venue.location.lng,
        // click handler
        () => {
            console.warn( venue.name + " " + venue.location.address );
        },
        iconURL
    ));
}

/**
 * creates a new Marker on the Google Map
 *
 * @param {number} latitude
 * @param {number} longitude
 * @param {Function=} optClickHandler optional function to execute when Marker is clicked
 *                   function will receive Marker as its first argument
 * @param {string=} optIcon optional URL to icon
 * @returns {google.maps.Marker} created Marker
 */
function addMarker( latitude, longitude, optClickHandler, optIcon ) {
    const markerData = {
        map: Map,
        position: {
            lat: latitude,
            lng: longitude
        }
    };

    // adding a custom image, see https://developers.google.com/maps/documentation/javascript/markers

    if ( typeof optIcon === "string" )
        markerData.icon = {
            url: optIcon,
            scaledSize: new google.maps.Size( 50, 50 )
        };

    const marker = new google.maps.Marker( markerData );

    if ( typeof optClickHandler === "function" )
        marker.addListener( "click", () => optClickHandler( marker ));

    return marker;
}

