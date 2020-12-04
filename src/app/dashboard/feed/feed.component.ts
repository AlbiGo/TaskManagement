import { Component, OnInit } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import {SignalRService} from '../../Services/signal-r.service'
import {NotificationServiceService } from '../../Services/notification-service.service'
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  constructor(private signalService : SignalRService , private notService : NotificationServiceService ) { }
  private hubConnection: signalR.HubConnection
allNot : any;
  ngOnInit() {
    debugger;
    this.notService.getAllNot().subscribe(p =>
      {
      console.log(p)
      this.allNot = p});
    this.hubConnection = this.signalService.startConnection();
    console.log(this.hubConnection)
    this.getFeedLive(this.hubConnection);
  }
  public getFeedLive = (hub :any) => {
    debugger
    let hubData : string = '';
    hub.on('sendToSpecificUser', (data) => {
      hubData = data;
      console.log("Feed");
    });
    return hubData;
  }
}
