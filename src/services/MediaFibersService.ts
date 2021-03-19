import { User } from '../models/user';
import { Stream } from '../models/stream';
import { StreamService } from './StreamService';


export class MediaFibersService {

    private streamService: StreamService

    public stream: Stream


    public streams: Map<string, Stream>

	constructor(){
       this.streamService = new StreamService()
       
    }

    public async publish(spdOffer): Promise<any> {
        this.streamService.createPipeline().then(() => {
            this.streamService.createWebRtcEndpoint().then(webrtc => {
                this.streamService.user.webRtcEndpoint = webrtc
               
                var candidate = this.streamService.getIceCandidate(this.streamService.user.webRtcEndpoint)
                if (!candidate) {
                    candidate = this.streamService.listenIceCandidate(this.streamService.user.webRtcEndpoint)
                }
                candidate.then(() => {
                    
                    this.streamService.processOffer(this.streamService.user.webRtcEndpoint, spdOffer)
                    this.streamService.user.webRtcEndpoint.connect(this.streamService.user.webRtcEndpoint, error => {
                        if (error) {
                            console.log(error)
                        }
                        this.streamService.gatherCandidates(this.streamService.user.webRtcEndpoint)
                    })
                })
            })
        })
        
	}

	public async view(spdOffer ): Promise<any> {
            this.streamService.createWebRtcEndpoint().then(webrtc => {
                this.streamService.user.webRtcEndpoint = webrtc
               
                var candidate = this.streamService.getIceCandidate(webrtc)
                if (!candidate) {
                    this.streamService.listenIceCandidate(webrtc).then(res => {
                        this.streamService.user.webRtcEndpoint.addIceCandidate(res);
                    })
                }
                this.streamService.processOffer(this.streamService.user.webRtcEndpoint,spdOffer)
                this.streamService.user.webRtcEndpoint.connect(this.streamService.user.webRtcEndpoint, (error) => {
                    if (error) {
                        console.log(error)
                    }
                    this.streamService.gatherCandidates(this.streamService.user.webRtcEndpoint)
                })
            })
        
	}

	
}