import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
data : any;
  constructor(private jwtHelper : JwtHelperService ) { }
  private hubConnection: signalR.HubConnection
  public startConnection = () => {
    let hub : signalR.HubConnection;
  let token = localStorage.getItem("token");
  let tokenObj = JSON.stringify((this.jwtHelper.decodeToken(token)));
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl('https://localhost:44342/NotificationAction',
                            {
                              skipNegotiation: true,
                              transport: signalR.HttpTransportType.WebSockets,
                              accessTokenFactory: () => token ,
                            })
                            .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
      hub =  this.hubConnection;
      return hub;
  }
  public addTransferChartDataListener = () => {
    let hubData : string = '';
    this.hubConnection.on('sendToUser', (data) => {
      hubData = data;
      console.log("Hub Data :" + hubData);
    });
    return hubData;
  }

  public 
}
