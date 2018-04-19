import { APIs } from '../config/Config';
import { Actions } from '../definitions/Actions';
const Axios  = require( "axios" );
const PubSub = require( "pubsub-js" );

const ENDPOINT = "https://api.foursquare.com/v2/";
const QUERY_OPTIONS = {
    limit: 50,          // default amount of results
    v: "20180323"       // default API version to use
};

const API = {

    /**
     * get a list of venues of given type
     *
     * @see https://developer.foursquare.com/docs/api/venues/search
     *
     * @param {string} type
     * @return {Promise}
     */
    venue( type ) {
        return fetch( getEndpoint( "venues/search", {
            query: type
        }));
    }
};

export { API };

/* internal methods */

/**
 * execute a query on the FourSquare API and handle
 * the response data
 *
 * @param {string} url
 * @return {Promise}npm run de
 */
function fetch( url ) {
    return new Promise(( resolve, reject ) => {
        Axios.get( url )
            .then(( result ) => {

                // poor mans validation, if status code 200 is returned
                // and we have a response Object, we're happy to continue

                if ( result.data.meta.code !== 200 || !result.data.response )
                    handleError( `Error during retrieval of "${url}"`, reject );

                resolve( result.data.response );
            })
            .catch(( error ) => {
                handleError( error );
            });
    });
}

/**
 * format the URL to a FourSquare API endpoint
 * this applies the default query options defined above
 * as well as querying the results for the Players current
 * position and travelling distance
 *
 * @param {string} route
 * @param {Object} optParams optional request key value pairs
 * @returns {string}
 */
function getEndpoint( route, optParams = {} ) {
    const authParams = `client_id=${APIs.FOURSQUARE.clientId}&client_secret=${APIs.FOURSQUARE.clientSecret}`;

    let url = `${ENDPOINT}${route}?${authParams}`;

    // specify Players current position and total range

    optParams = Object.assign( optParams, {
        ll: "4.895168, 52.370216",      // Amsterdam
        radius: 500 // in meters
    });

    // apply default options for API version and limit of results

    const params = Object.assign( optParams, QUERY_OPTIONS );

    Object.keys( params ).forEach(( key ) => {
        url += `&${key}=${optParams[key]}`;
    });
    url += `&${optParams}`;

    return url;
}

function handleError( error, reject ) {
    PubSub.publish(
        Actions.SHOW_ERROR, { message: error }
    );
    reject();
}
