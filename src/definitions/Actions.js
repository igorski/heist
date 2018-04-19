/**
 * Actions specify all messages that are
 * broadcast over the pubsub message bus.
 * Interested actors can subscribe to these.
 *
 * The behaviours associated with these are handled by the controllers.
 *
 * @enum {string}
 */
const Actions = {

    // "system" messages (e.g. broadcasting feedback/Error states)

    SHOW_FEEDBACK : "A0",  // payload { title: string, message: string, optConfirm: function }
    SHOW_ERROR    : "A1",  // payload { message: string }

    // game related

    GAME_OVER          : "G0",
    GAME_BANK_SELECT   : "G1", // payload Object (bank venue data)
    GAME_POLICE_SELECT : "G2", // payload Object (bank venue data)
    GAME_GAS_SELECT    : "G3", // payload Object (bank venue data)

    // FourSquare related

    GET_VENUE_DETAILS: "F0",

    // map related

    FLUSH_ALL_MARKERS: "M0",
    CREATE_MARKERS   : "M1", // payload { banks: Array<Object>, police: Array<Object>, gas: Array<Object> }
    POSITION_PLAYER  : "M2"
};

export { Actions };
