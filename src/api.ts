import { WsServerService } from './services/WsServerService';
import express from 'express';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import {environmentApi as envApi} from './environments/environment.api';
import {environmentApp as envApp} from './environments/environment.app';
import {app as callController} from './controllers/CallController';

const api = express();
api.use(express.static('public'));
api.use(express.json());

api.use('/api', callController);

const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, envApi.serverKey)),
    cert: fs.readFileSync(path.join(__dirname, envApi.serverCert)),
}, api).listen(envApp.serverPort, () => {
    console.log('---------------------------------------------------------');
    console.log(`OnLiners server URL: ${envApp.serverUrl}:${envApp.serverPort}`);
    console.log('---------------------------------------------------------');
});

new WsServerService(server)


