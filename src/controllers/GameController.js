import * as FourSquareService from '../services/FourSquareService';
import * as TemplateService from '../services/TemplateService';
import { Templates } from '../config/Config';
import { Actions } from '../definitions/Actions';
import { Copy } from '../definitions/Copy';
import { Locations, Categories } from '../definitions/Enums';
import { Player, World } from '../model/Game';
const PubSub = require("pubsub-js");

/* game constants */

const REWARD    = 500,
      GAS_PRICE = 250;

/* variables */

let banks, police, gas;
let container;

export function init() {

    // subscribe to messages indicating we should show some feedback to the user

    [
        Actions.GAME_OVER,
        Actions.GAME_POLICE_SELECT,
        Actions.GAME_BANK_SELECT,
        Actions.GAME_GAS_SELECT,
        Actions.ROB_BANK

    ].forEach(( message ) => PubSub.subscribe( message, handleBroadcast ));

    // get reference to DOM elements

    container = document.querySelector( "#stats" );

    // let's get crackin' with that FourSquare API, e.g. fill the world with venues!

    updateWorld();

    // show friendly welcome message stating what this pile of code is about.

    PubSub.publish( Actions.SHOW_FEEDBACK, { title: Copy.INTRO.title, message: Copy.INTRO.message });
}

/* internal methods */

function handleBroadcast( message, payload ){

    switch ( message ) {

        case Actions.GAME_OVER:
            PubSub.publish( Actions.SHOW_FEEDBACK, {
                title: Copy.GAME.OVER.title,
                message: Copy.GAME.OVER.message.replace( "{0}", Player.money ),
                optConfirm: () => {
                    // very cheap way to re-initialize everything
                    window.location.reload();
                }
            });
            break;

        case Actions.GAME_POLICE_SELECT:
            handlePoliceSelect( payload );
            break;

        case Actions.GAME_BANK_SELECT:
            handleBankSelect( payload );
            break;

        case Actions.GAME_GAS_SELECT:
            handleGasSelect( payload );
            break;
    }
}

/**
 * for our quaint little game, "populating the world" means that
 * we fetch all Banks, Police stations and Gas Stations within the Players available
 * vicinity (e.g. radius) and broadcast a request to render Markers
 * from the GoogleMapsService
 */
function updateWorld() {

    // update player data

    TemplateService.inject( Templates.STATS_DISPLAY, container, {
        money: Player.money,
        radius: Player.radius
    });

    // retrieve all venues

    police = [], banks = [], gas = [];

    // a bit of a Promise pyramid which could benefit from async - await !

    FourSquareService.API.venues( Locations.POLICE )
        .then(( policeData ) => {
            police = policeData.venues;

        FourSquareService.API.venues( Locations.BANK, Categories.BANK )
            .then(( bankData ) => {
                banks = bankData.venues;

            FourSquareService.API.venues( Locations.GAS )
            .then(( gasData ) => {

                gas = gasData.venues;

                // flush existing markers and render the new list
                // not entirely low on overhead with regards to reusable
                // resource, but we're in a rush ;)

                PubSub.publishSync( Actions.FLUSH_MARKERS );
                PubSub.publishSync( Actions.CREATE_MARKERS, { police, banks, gas });
            });
       })})
       .catch(( error ) => PubSub.publish( Actions.SHOW_ERROR, { message: error }));
}

/**
 * methods that change the game's state
 * this is where you rob banks (gain money)
 * or buy gas (allowing you to cover a large area)
 * and race the police
 *
 * there is some fugliness here as they all need to do an async operation (e.g.
 * fetching venue details from FourSquare), while this is nicely fast, in case of network
 * delays the application doesn't show much change until data is available...
 */
function handleBankSelect( bank ) {

    // do not allow double visits if you already robbed this place
    if ( hasVisited( bank )) {
        return;
    }
    FourSquareService.API.info( bank.id )
        .then(( data ) => {

            // banks are quite boring to mine data for in FourSquare, we use
            // the "tips" value to calculate a multiplier for the bank, which basically
            // means it will give your more money when you decice to rob it!

            const venueData  = data.venue;
            const multiplier = Math.max( 1, venueData.tips.count ); // at least 1 !
            const reward     = REWARD * multiplier;
            const distance   = bank.location.distance;

            // address is not always returned by FourSquare API (sometimes undefined)
            const address = bank.location.address || "sorta secret address";
            const message = Copy.GAME.INTERACTION.bank
                                .replace( "{A}", address )
                                .replace( "{D}", distance )
                                .replace( "{$}", reward );

            PubSub.publish( Actions.SHOW_FEEDBACK, {
                title: bank.name,
                message: message,
                optConfirm: () => {
                    // award money, set bank as visited and subtract gasoline
                    Player.money += reward;
                    World.visited.push( bank.id );
                    handleTravel( bank );

                    // the chase is on
                    // TODO: move police car in your direction

                    // re-render world to reflect changes
                    updateWorld();
                }
            });
        });
}

function handleGasSelect( gas ) {

    // do not allow double visits if you already purchased gas here
    if ( hasVisited( gas )) {
        return;
    }

    FourSquareService.API.info( gas.id )
        .then(( data ) => {

            // gas stations are ALSO quite boring to mine data for in FourSquare, we use
            // the "tips" value to calculate a multiplier for the station, which basically
            // means it will be more expensive to buy gas!

            const venueData  = data.venue;
            const multiplier = Math.max( 1, venueData.tips.count ); // at least 1 !
            const reward     = multiplier * 2;
            const price      = GAS_PRICE * multiplier;

            // address is not always returned by FourSquare API (sometimes undefined)
            const address = gas.location.address || "sorta secret address";
            const message = Copy.GAME.INTERACTION.gas
                                .replace( "{A}", address )
                                .replace( "{G}", reward )
                                .replace( "{$}", price );

            PubSub.publish( Actions.SHOW_FEEDBACK, {
                title: gas.name,
                message: message,
                optConfirm: () => {

                    // not enough money to buy gas!

                    if ( Player.money < price ) {
                        return PubSub.publish( Actions.SHOW_FEEDBACK, {
                            title: "", message: Copy.GAME.STATE.funds
                        });
                    }

                    // increase travel radius and subtract money
                    Player.radius *= reward;
                    Player.money  -= price;

                    // set gas station as visited
                    World.visited.push( gas.id );

                    // re-render world to reflect changes
                    updateWorld();
                }
            });
        });
}

function handlePoliceSelect( police ) {
    const distance = police.location.distance;
    console.warn(distance);

    // address is not always returned by FourSquare API (sometimes undefined)
    const address = police.location.address || "sorta secret address";
    const message = Copy.GAME.INTERACTION.police
                        .replace( "{A}", address )
                        .replace( "{D}", distance );

    PubSub.publish( Actions.SHOW_FEEDBACK, {
        title: police.name,
        message: message
    });
}

/**
 * handle the travel to a location (e.g. after robbing
 * a bank or buying gas)
 */
function handleTravel( venue ) {
    Player.radius = Math.max( 0, Player.radius - venue.location.distance );

    // cannot continue, your travel radius is 0 !

    if ( Player.radius === 0 )
        PubSub.publish( Actions.GAME_OVER );

    // update player location

    Player.latitude  = venue.location.lat;
    Player.longitude = venue.location.lng;

    PubSub.publish( Actions.POSITION_PLAYER );
}

/**
 * verify whether the player can interact with this venue
 * again, will pop up a message if not
 */
function hasVisited( venue ) {
    if ( World.visited.indexOf( venue.id ) === -1 ) {
        return false;
    }
    PubSub.publish( Actions.SHOW_FEEDBACK, {
        title: "", message: Copy.GAME.STATE.visited
    });
    return true;
}
