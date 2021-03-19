import { randomBytes } from 'crypto';
import { User } from '../models/user';
import { Stream } from '../models/stream';
import {environmentApi as env} from '../environments/environment.api';
import {WebRtcEndpoint, getSingleton, ClientInstance, MediaPipeline, getComplexType} from 'kurento-client';

export class StreamService {
    public user: User
    private stream: Stream
    private client: ClientInstance
    // private pipeline: MediaPipeline
    // private webRtcEndpoint: WebRtcEndpoint

    private candidatesQueue: Map<string, any>
    // private err: string

    constructor() {
        this.stream = new Stream(randomBytes(16).toString())
       this.connect().then(resolve => {
           this.client = resolve
       }).catch(e => {
           console.log("Error: "+ e)
       })
    }

    private async connect(): Promise<ClientInstance> {
        return getSingleton(env.mediaFibersUrl, {
            request_timeout: 30,
            response_timeout: 30
        })
    }


    public async createPipeline(): Promise<MediaPipeline> {
        return this.client.create('MediaPipeline')
    }

    public async createWebRtcEndpoint(): Promise<WebRtcEndpoint> {
        return this.client.create('WebRtcEndpoint')
    }

    public async listenIceCandidate(webRtcEndpoint: WebRtcEndpoint): Promise<any> {
        return webRtcEndpoint.on('OnIceCandidate', (event) => {
            var candidate = getComplexType('IceCandidate')(event.candidate);
            this.user.ws.send(JSON.stringify({
                id : 'iceCandidate',
                candidate : candidate
            }));
        });
    }

    public async getIceCandidate(webRtcEndpoint: WebRtcEndpoint) {
        if (this.candidatesQueue.get(this.stream.id)) {
            while(this.candidatesQueue.size) {
                var candidate = this.candidatesQueue.get(this.stream.id).shift();
                return Promise.bind((resolve) => {
                    resolve(webRtcEndpoint.addIceCandidate(candidate))
                })
            }
        }
        return candidate
    }

    public async processOffer(webRtcEndpoint: WebRtcEndpoint, sdpOffer) {
        webRtcEndpoint.processOffer(sdpOffer, (error, sdpAnswer) => {
            if (error) {
                console.log("Error on spdOffer: " + error)
                return
            }

            this.user.ws.send(JSON.stringify({
                id : 'presenterResponse',
                response : 'accepted',
                sdpAnswer : sdpAnswer
            }));
        });
    }

    public async gatherCandidates(webRtcEndpoint: WebRtcEndpoint) {
        webRtcEndpoint.gatherCandidates(function(error) {
            console.log("Error on gather candidates: "+ error)
        });
    }


    // private stop(sessionId: string) {
    //     if (this.stream.publishers.size == 0) {
    //         for (var i in this.stream.viewers) {
    //             var viewer = this.stream.viewers.get(i);
    //             if (viewer.ws) {
    //                 viewer.ws.send(JSON.stringify({
    //                     id : 'stopCommunication'
    //                 }));
    //             }
    //         }

    //         this.stream.pipeline.release();
    //         this.stream.publishers.clear();
    //         this.stream.viewers.clear();
    
    //     } else if (this.stream.viewers.get(sessionId)) {
    //         this.stream.viewers.get(sessionId).webRtcEndpoint.release();
    //         delete this.stream.viewers.delete;
    //     }
    
    //     this.clearCandidatesQueue(sessionId);
    
    //     if (this.stream.viewers.size < 1 && this.stream.publishers.size == 0) {
    //         console.log('Closing kurento client');
    //         this.client.close();
    //     }
    // }

    // private clearCandidatesQueue(sessionId) {
    //         this.stream.candidatesQueue.delete(sessionId);
    // }
}