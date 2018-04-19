import { APIs } from '../config/Config';
import { Actions } from '../definitions/Actions';

const ENDPOINT = "https://maps.googleapis.com/maps/api/js";
const ScriptLoader = require( "tiny-script-loader/loadScript" );

// reference to the Google Maps API, once loaded
let Map;

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

                // create Google Map and by default centered in Amsterdam

                const lat = 52.370216;
                const lng = 4.895168;

                Map = new google.maps.Map( document.getElementById( "googleMap" ), {
                    zoom: 15,
                    center: { lat, lng },
                    mapTypeControl: true,
                    mapTypeControlOptions: {
                        mapTypeIds: [] // hides terrain switching controls
                    }
                });

                // create a Marker centering in Amsterdam city center

                addMarker( lat, lng, () => {
                    console.warn( "clicky clicky" );
                });

                resolve();
            });
    });
};

const API = {

};

export { init, API };

/* internal methods */

/**
 * creates a new Marker on the Google Map
 *
 * @param {number} latitude
 * @param {number} longitude
 * @param {Function=} optClickHandler optional function to execute when Marker is clicked
 *                   function will receive Marker as its first argument
 */
function addMarker( latitude, longitude, optClickHandler ) {
   const marker = new google.maps.Marker({
        map: Map,
        position: {
            lat: latitude,
            lng: longitude
        }
    });

    if ( typeof optClickHandler === "function" )
        marker.addListener( "click", () => optClickHandler( marker ));

    return marker;
}
