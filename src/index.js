// Load application styles
import 'styles/index.scss';

import { Templates } from './config/Config';
import { Actions } from './definitions/Actions';

// require all of our applications core actors
// e.g. all individual controllers, services and the pubsub-js
// to setup the publish-subscribe messaging system
// to communicate state changes

import { init as SystemControllerInit } from './controllers/SystemController';
const PubSub = require("pubsub-js");

// initialize all actors

SystemControllerInit();

PubSub.publish( Actions.SHOW_FEEDBACK, { title: "Hello", message: "Sup?" });
