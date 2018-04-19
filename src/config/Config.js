// all HTML templates used by the application
// these are essentially prepackaged into the application and
// not loaded on-demand (see TemplateService)

const Templates = {
    MESSAGE_DIALOG: require( "ejs-compiled-loader!../../assets/templates/message.ejs" )
};

// configurations for third party APIs

const APIs = {
    FOURSQUARE: {
        clientId: "",
        clientSecret: ""
    },
    GOOGLE_MAPS: {
        key: ""
    }
};

export { Templates, APIs };
