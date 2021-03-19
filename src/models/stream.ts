import { User } from './user';
import kurento from "kurento-client";

export class Stream {
    public id: string
    public pipeline: kurento.MediaPipeline
    public webRtcEndpoint: kurento.WebRtcEndpoint

    public owner: User
    public publishers: Map<string, User>
    public viewers: Map<string, User>

    public candidatesQueue: Map<string, any>
    constructor(parameters) {
        
    }
}