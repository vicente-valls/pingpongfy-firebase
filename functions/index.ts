import * as functions from "firebase-functions";
import {InversifyExpressServer} from "inversify-express-utils";
import {container} from "./ioc/IoC";

require("source-map-support").install();

import "./ioc/Loader";

// start the server
let server = new InversifyExpressServer(container);
let apiServer = server.build();
exports.api = functions.https.onRequest(apiServer);
