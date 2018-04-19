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
    SHOW_FEEDBACK: "A0", // payload { title: string, message: string }
    SHOW_ERROR   : "A1"  // payload { message: string }
};

export { Actions };
