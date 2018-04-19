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

    SHOW_FEEDBACK : "A0", // payload { message: string }
    SHOW_ERROR    : "A1",  // payload { message: string }

    // game related

    // map related

    FLUSH_ALL_MARKERS: "M0",
    CREATE_MARKERS   : "M1"  // payload { banks: Array<Object>, police: Array<Object> }


};

export { Actions };
