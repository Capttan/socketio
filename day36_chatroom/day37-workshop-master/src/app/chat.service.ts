import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';

const WS_SERVER_URL = environment.ws_server_url;

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  backendApiUrl = environment.api_url;

  private socket;
  private ws: WebSocket;

  constructor(private http: HttpClient) { }

  getAllGroup(): Promise<any> {
    return this.http.get<any>(`${this.backendApiUrl}/list`).toPromise();
  }

  public initSocket(): void {
    console.log(">>>>> " + WS_SERVER_URL);
    this.socket = socketIo(WS_SERVER_URL);
    this.ws = new WebSocket(WS_SERVER_URL);
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  sendMessage(message: any): void {
      this.socket.emit('message', message);
  }

  public onMessage(): Observable<any> {
      return new Observable<any>(observer => {
          this.socket.on('message', (data: any) => observer.next(data));
      });
  }

  public onEvent(event: Event): Observable<any> {
      return new Observable<Event>(observer => {
          this.socket.on(event, () => observer.next());
      });
  }
}
