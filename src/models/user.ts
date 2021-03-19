import * as kClient from "kurento-client"
import * as kUtils from "kurento-utils"
import WebSocket from "ws"

export class User {
    public id: string
    public username: string
    public ws: WebSocket
    public webRtcEndpoint: kClient.WebRtcEndpoint
    public webRtcPeer: kUtils.WebRtcPeer
    public sdpOffer: string

    constructor() {
        
    }
}