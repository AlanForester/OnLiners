import {Server} from 'ws';
import * as https from 'https';
import { Observable, Subject } from 'rxjs';
import { Observer } from 'rxjs';

export class WsServerService {

    private channel: Subject<string>;

    private instance: Server;

    constructor(server: https.Server) {
            this.instance = new Server({
                 server: server,
                 path: '/ws'
             });
    }

    public listen(query: string = "") {
        const subscriptionFn = (observer: Observer<string>) => {
            this.instance.on('connection', (webSock) => {
                
                console.log('Connection received ');
                webSock.on('error',  (error) => {
                    observer.error(error.message);
                    console.log('Connection error: ' +  error);
                });
    
                webSock.on('close',  () => {
                    observer.complete();
                    console.log('Connection close');
                });
     
                webSock.on('message',  (_message: any) => {
                    var message = JSON.parse(_message);
                    if (message.id == query || query == "") {
                        observer.next(_message);
                    }
                    console.log('Message ' + _message );
                });
            });

            this.instance.addListener('message',  (_message: any) => {
                var message = JSON.parse(_message);
                if (message.id == query || query == "") {
                    observer.next(_message);
                }
                console.log('Message2 ' + _message );
            })

            return () => this.instance.close
          }
          
          return new Observable(subscriptionFn);
    }

    public subscribe(): Subject<string> {
        this.channel = new Subject<string>();

        this.instance.on('connection', (webSock) => {
            const sessionId = '123';

            console.log('Connection received with sessionId ' + sessionId);

            webSock.on('error',  (error) => {
                this.channel.error(error)
                console.log('Connection ' + sessionId + ' error');
            });
            
            webSock.on('close',  () => {
                this.channel.complete()
                console.log('Connection ' + sessionId + ' closed');
            });

            webSock.on('message',  (_message: string) => {
                this.channel.next(_message)
                console.log('Message ' + _message );
            });

        });

        return this.channel
    }

    public async send(data: any): Promise<any> {
        try {
            // this.instance.send()
        } catch (error) {
            throw error;
        }
    }
}