import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { ENV } from '../shared/env'

export interface Message {
  message: string;
}

@Injectable()
export class AlertsService {
  private websocket: any;
  private receivedMsg: any;
  public env = ENV

  public sendMessage(text: string) {
    this.websocket.send(text);
  }

  public GetInstanceStatus(): Observable<any> {
    this.websocket = new WebSocket(this.env.wsUrl);
    this.websocket.onopen = (evt) => {
      this.websocket.send(JSON.stringify({ command: "subscribe", identifier: JSON.stringify({ channel: 'AlertsChannel' }), type: "confirm_subscription" }));
      this.websocket.send(JSON.stringify({ command: "subscribe", identifier: JSON.stringify({ channel: 'PredictionsChannel' }), type: "confirm_subscription" }));
      this.websocket.send(JSON.stringify({ command: "subscribe", identifier: JSON.stringify({ channel: 'SchedulesChannel' }), type: "confirm_subscription" }));
    };
    return Observable.create(observer => {
      this.websocket.onmessage = (evt) => {
        observer.next(evt);
      };
    })
      .map(res => JSON.parse(res.data))
      .share();
  }
}