import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';

const CHAT_URL = 'ws://localhost:3000/cable';

export interface Message {
    message: string;
}

@Injectable()
export class AlertsService {
    private websocket: any;
    private receivedMsg: any;
    
    public sendMessage(text:string){
      this.websocket.send(text);
    }

    public GetInstanceStatus(): Observable<any>{
      this.websocket = new WebSocket("ws://localhost:3000/cable"); //dummy echo websocket service
      this.websocket.onopen =  (evt) => {
          this.websocket.send(JSON.stringify({command: "subscribe", identifier: JSON.stringify({channel: 'AlertsChannel'}),type: "confirm_subscription"}));
      };
      return Observable.create(observer=>{
          this.websocket.onmessage = (evt) => { 
              observer.next(evt);
          };
      })
      .map(res => JSON.parse(res.data))
      .share();
    }
}