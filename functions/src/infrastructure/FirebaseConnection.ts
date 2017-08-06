import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import SYMBOLS from "../../ioc/Symbols";
import {provideSingleton} from "../../ioc/IoC";


@provideSingleton(SYMBOLS.FirebaseAppConnection)
export class FirebaseAppConnection {
    private appConnection: admin.app.App;
    constructor() {
        this.appConnection = admin.initializeApp(functions.config().firebase);
    }

    public getDatabase(): admin.database.Database {
        return this.appConnection.database();
    }
}
