import { __decorate } from "tslib";
import { HttpHeaders } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';
let AppComponent = class AppComponent {
    constructor(httpClient) {
        this.httpClient = httpClient;
        this.OPENVIDU_SERVER_URL = 'https://' + location.hostname + ':4443';
        this.OPENVIDU_SERVER_SECRET = 'MY_SECRET';
        this.subscribers = []; // Remotes
        this.generateParticipantInfo();
    }
    beforeunloadHandler() {
        // On window closed leave session
        this.leaveSession();
    }
    ngOnDestroy() {
        // On component destroyed leave session
        this.leaveSession();
    }
    joinSession() {
        // --- 1) Get an OpenVidu object ---
        // --- 2) Init a session ---
        // --- 3) Specify the actions when events take place in the session ---
        // On every new Stream received...
        
    }
    leaveSession() {
        // --- 7) Leave the session by calling 'disconnect' method over the Session object ---
       
        this.generateParticipantInfo();
    }
    generateParticipantInfo() {
        // Random user nickname and sessionId
        this.mySessionId = 'SessionA';
        this.myUserName = 'Participant' + Math.floor(Math.random() * 100);
    }
    // deleteSubscriber(streamManager) {
    //     let index = this.subscribers.indexOf(streamManager, 0);
    //     if (index > -1) {
    //         this.subscribers.splice(index, 1);
    //     }
    // }
    // updateMainStreamManager(streamManager) {
    //     this.mainStreamManager = streamManager;
    // }
    /**
     * --------------------------
     * SERVER-SIDE RESPONSIBILITY
     * --------------------------
     * This method retrieve the mandatory user token from OpenVidu Server,
     * in this case making use Angular http API.
     * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION. In this case:
     *   1) Initialize a session in OpenVidu Server	 (POST /api/sessions)
     *   2) Generate a token in OpenVidu Server		   (POST /api/tokens)
     *   3) The token must be consumed in Session.connect() method of OpenVidu Browser
     */
    getToken() {
        return this.createSession(this.mySessionId).then(sessionId => {
            return this.createToken(sessionId);
        });
    }
    
    createSession(sessionId) {
        return new Promise((resolve, reject) => {
            const body = JSON.stringify({ customSessionId: sessionId });
            const options = {
                headers: new HttpHeaders({
                    'Authorization': 'Basic ' + btoa('OPENVIDUAPP:' + this.OPENVIDU_SERVER_SECRET),
                    'Content-Type': 'application/json'
                })
            };
            return this.httpClient.post(this.OPENVIDU_SERVER_URL + '/api/sessions', body, options)
                .pipe(catchError(error => {
                if (error.status === 409) {
                    resolve(sessionId);
                }
                else {
                    console.warn('No connection to OpenVidu Server. This may be a certificate error at ' + this.OPENVIDU_SERVER_URL);
                    if (window.confirm('No connection to OpenVidu Server. This may be a certificate error at \"' + this.OPENVIDU_SERVER_URL +
                        '\"\n\nClick OK to navigate and accept it. If no certificate warning is shown, then check that your OpenVidu Server' +
                        'is up and running at "' + this.OPENVIDU_SERVER_URL + '"')) {
                        location.assign(this.OPENVIDU_SERVER_URL + '/accept-certificate');
                    }
                }
                return observableThrowError(error);
            }))
                .subscribe(response => {
                console.log(response);
                resolve(response['id']);
            });
        });
    }
    createToken(sessionId) {
        return new Promise((resolve, reject) => {
            const body = JSON.stringify({ session: sessionId });
            const options = {
                headers: new HttpHeaders({
                    'Authorization': 'Basic ' + btoa('OPENVIDUAPP:' + this.OPENVIDU_SERVER_SECRET),
                    'Content-Type': 'application/json'
                })
            };
            return this.httpClient.post(this.OPENVIDU_SERVER_URL + '/api/tokens', body, options)
                .pipe(catchError(error => {
                reject(error);
                return observableThrowError(error);
            }))
                .subscribe(response => {
                console.log(response);
                resolve(response['token']);
            });
        });
    }
};
__decorate([
    HostListener('window:beforeunload')
], AppComponent.prototype, "beforeunloadHandler", null);
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map