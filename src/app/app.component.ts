import {uniqueNamesGenerator, adjectives, colors, animals}  from 'unique-names-generator';
import { Stream } from './../models/stream';
import { User } from './../models/user';
import { Component } from '@angular/core';

import * as kUtils from 'kurento-utils';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // OPENVIDU_SERVER_URL = 'https://' + location.hostname + ':4443';

  
  stream: Stream;
  user: User = new User; // Local
  video: any
  // Join form
  mySessionId: string;
  myUserName: string;

  // Main video of the page, will be 'publisher' or one of the 'subscribers',
  // updated by click event in UserVideoComponent children
  constructor() {

    const randomName: string = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    }); 
    
    this.user.username = randomName;

    console.log(this.user.username)
    
    this.video = document.getElementById('video');

    document.getElementById('call').addEventListener('click', () => { this.presenter(); } );
    document.getElementById('viewer').addEventListener('click', () => { this.viewer(); } );
    document.getElementById('terminate').addEventListener('click', () => { this.stop(); } );
  }

  ngOnDestroy() {
    // On component destroyed leave session
  }

  viewer() {
    if (!this.user.webRtcEndpoint) {
      this.showSpinner();
  
      var options = {
        // remoteVideo: this.video,
        onicecandidate : this.onIceCandidate
      }
  
    var webRtcPeer = kUtils.WebRtcPeer.WebRtcPeerSendonly(options, error =>  {
        if(error) {
          console.log("Error: "+ error)
        }
      });
    }
    webRtcPeer.generateOffer(this.onOfferViewer)
  }
  

  onOfferViewer(error, offerSdp) {
    if (error) {
      console.log("Error: "+ error)
    }

    var message = {
      id : 'viewer',
      sdpOffer : offerSdp
    }
    this.sendMessage(message);
  }

   presenter() {
    if (!this.user.webRtcEndpoint) {
      this.showSpinner();
  
      var options = {
        localVideo: this.video,
        onicecandidate : this.onIceCandidate
        }
  
        this.user.webRtcPeer = kUtils.WebRtcPeer.WebRtcPeerSendonly(options, (error) => {
          if(error) {
            console.log(error)
          }
        });

        this.user.webRtcPeer.generateOffer(this.onOfferPresenter);
    }
  }
  

  onOfferPresenter(error, offerSdp) {
    if (error) {
      console.log("Error: "+ error)
    }

	var message = {
		id : 'presenter',
		sdpOffer : offerSdp
	};
	this.sendMessage(message);
}


showSpinner() {
	for (var i = 0; i < arguments.length; i++) {
		arguments[i].poster = './img/transparent-1px.png';
		arguments[i].style.background = 'center transparent url("./img/spinner.gif") no-repeat';
	}
}

onIceCandidate(candidate) {
	   console.log('Local candidate' + JSON.stringify(candidate));

	   var message = {
	      id : 'onIceCandidate',
	      candidate : candidate
	   }
	   this.sendMessage(message);
}

  joinSession() {
    let room = this.makeRandom(20) 
    this.stream = new Stream(room)
  }

  stop() {
    if (this.user.webRtcPeer) {
      var message = {
          id : 'stop'
      }
      this.sendMessage(message);
      this.user.webRtcPeer.dispose();
    }
  }

  dispose() {
    if (this.user.webRtcPeer) {
      this.user.webRtcPeer.dispose();
      this.user.webRtcPeer = null;
    }
    // this.hideSpinner(this.video);
  }
  

  sendMessage(message) {
    var jsonMessage = JSON.stringify(message);
    console.log('Sending message: ' + jsonMessage);
    this.user.ws.send(jsonMessage);
  }

  
  leaveSession() {

    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    // Empty all properties...
  
    delete this.stream;
  }

  makeRandom(lengthOfCode: number): string {
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

      let text = "";
      for (let i = 0; i < lengthOfCode; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
  }

}
