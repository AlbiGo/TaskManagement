import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit ,ViewChild ,Injectable,Inject ,forwardRef} from '@angular/core';
import {NgbCollapse} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, JsonPipe } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {  JwtHelperService } from '@auth0/angular-jwt';
import { SwPush } from '@angular/service-worker';
import { RouterOutlet, Router, ActivationStart } from '@angular/router';
import {SignalRService} from '../../Services/signal-r.service'
import * as signalR from "@aspnet/signalr";
import { NotificationServiceService } from '../../Services/notification-service.service';
import { UserLoginServiceService } from '../../Services/user-login-service.service';
import { Observable, of } from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';

const statesWithFlags: {name: string, flag: string}[] = [
  {'name': 'Alabama', 'flag': '5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'},
  {'name': 'Alaska', 'flag': 'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png'},
  {'name': 'Arizona', 'flag': '9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png'},
  {'name': 'Arkansas', 'flag': '9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png'},
  {'name': 'California', 'flag': '0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png'},
  {'name': 'Colorado', 'flag': '4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png'},
  {'name': 'Connecticut', 'flag': '9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png'},
  {'name': 'Delaware', 'flag': 'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png'},
  {'name': 'Florida', 'flag': 'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png'},
  {
    'name': 'Georgia',
    'flag': '5/54/Flag_of_Georgia_%28U.S._state%29.svg/46px-Flag_of_Georgia_%28U.S._state%29.svg.png'
  },
  {'name': 'Hawaii', 'flag': 'e/ef/Flag_of_Hawaii.svg/46px-Flag_of_Hawaii.svg.png'},
  {'name': 'Idaho', 'flag': 'a/a4/Flag_of_Idaho.svg/38px-Flag_of_Idaho.svg.png'},
  {'name': 'Illinois', 'flag': '0/01/Flag_of_Illinois.svg/46px-Flag_of_Illinois.svg.png'},
  {'name': 'Indiana', 'flag': 'a/ac/Flag_of_Indiana.svg/45px-Flag_of_Indiana.svg.png'},
  {'name': 'Iowa', 'flag': 'a/aa/Flag_of_Iowa.svg/44px-Flag_of_Iowa.svg.png'},
  {'name': 'Kansas', 'flag': 'd/da/Flag_of_Kansas.svg/46px-Flag_of_Kansas.svg.png'},
  {'name': 'Kentucky', 'flag': '8/8d/Flag_of_Kentucky.svg/46px-Flag_of_Kentucky.svg.png'},
  {'name': 'Louisiana', 'flag': 'e/e0/Flag_of_Louisiana.svg/46px-Flag_of_Louisiana.svg.png'},
  {'name': 'Maine', 'flag': '3/35/Flag_of_Maine.svg/45px-Flag_of_Maine.svg.png'},
  {'name': 'Maryland', 'flag': 'a/a0/Flag_of_Maryland.svg/45px-Flag_of_Maryland.svg.png'},
  {'name': 'Massachusetts', 'flag': 'f/f2/Flag_of_Massachusetts.svg/46px-Flag_of_Massachusetts.svg.png'},
  {'name': 'Michigan', 'flag': 'b/b5/Flag_of_Michigan.svg/45px-Flag_of_Michigan.svg.png'},
  {'name': 'Minnesota', 'flag': 'b/b9/Flag_of_Minnesota.svg/46px-Flag_of_Minnesota.svg.png'},
  {'name': 'Mississippi', 'flag': '4/42/Flag_of_Mississippi.svg/45px-Flag_of_Mississippi.svg.png'},
  {'name': 'Missouri', 'flag': '5/5a/Flag_of_Missouri.svg/46px-Flag_of_Missouri.svg.png'},
  {'name': 'Montana', 'flag': 'c/cb/Flag_of_Montana.svg/45px-Flag_of_Montana.svg.png'},
  {'name': 'Nebraska', 'flag': '4/4d/Flag_of_Nebraska.svg/46px-Flag_of_Nebraska.svg.png'},
  {'name': 'Nevada', 'flag': 'f/f1/Flag_of_Nevada.svg/45px-Flag_of_Nevada.svg.png'},
  {'name': 'New Hampshire', 'flag': '2/28/Flag_of_New_Hampshire.svg/45px-Flag_of_New_Hampshire.svg.png'},
  {'name': 'New Jersey', 'flag': '9/92/Flag_of_New_Jersey.svg/45px-Flag_of_New_Jersey.svg.png'},
  {'name': 'New Mexico', 'flag': 'c/c3/Flag_of_New_Mexico.svg/45px-Flag_of_New_Mexico.svg.png'},
  {'name': 'New York', 'flag': '1/1a/Flag_of_New_York.svg/46px-Flag_of_New_York.svg.png'},
  {'name': 'North Carolina', 'flag': 'b/bb/Flag_of_North_Carolina.svg/45px-Flag_of_North_Carolina.svg.png'},
  {'name': 'North Dakota', 'flag': 'e/ee/Flag_of_North_Dakota.svg/38px-Flag_of_North_Dakota.svg.png'},
  {'name': 'Ohio', 'flag': '4/4c/Flag_of_Ohio.svg/46px-Flag_of_Ohio.svg.png'},
  {'name': 'Oklahoma', 'flag': '6/6e/Flag_of_Oklahoma.svg/45px-Flag_of_Oklahoma.svg.png'},
  {'name': 'Oregon', 'flag': 'b/b9/Flag_of_Oregon.svg/46px-Flag_of_Oregon.svg.png'},
  {'name': 'Pennsylvania', 'flag': 'f/f7/Flag_of_Pennsylvania.svg/45px-Flag_of_Pennsylvania.svg.png'},
  {'name': 'Rhode Island', 'flag': 'f/f3/Flag_of_Rhode_Island.svg/32px-Flag_of_Rhode_Island.svg.png'},
  {'name': 'South Carolina', 'flag': '6/69/Flag_of_South_Carolina.svg/45px-Flag_of_South_Carolina.svg.png'},
  {'name': 'South Dakota', 'flag': '1/1a/Flag_of_South_Dakota.svg/46px-Flag_of_South_Dakota.svg.png'},
];

export interface Notification
{
  articleHeading : string;
  articleContent : string;
  opened : boolean;
  createOn : string;
  id : string;
}
export interface user{
  id : string;
}

import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavbarComponent implements OnInit {
  @ViewChild(RouterOutlet, {static: true}) outlet: RouterOutlet;
  public iconOnlyToggled = false;
  public sidebarToggled = false;
  newNot : boolean = false;
  constructor(       
    @Inject(forwardRef(() => SwPush)) readonly  swPush: SwPush,
        private date : DatePipe , 
        private http : HttpClient,
        private jwtHelper : JwtHelperService ,
        private router: Router,
        private rsignal : SignalRService,
        private notService : NotificationServiceService,
        private userService : UserLoginServiceService,
        config: NgbDropdownConfig
    ) 

  {
    console.log(date)
    this.test = this.dateNow.toString();
    console.log(this.dateNow)
    config.placement = 'bottom-right';

    // swPush.subscription.subscribe((subscription) => {
    //   this._subscription = subscription;
    //   this.operationName = (this._subscription === null) ? 'Subscribe' : 'Unsubscribe';
    // });    

   }

   public model: any;

   search = (text$: Observable<string>) =>
     text$.pipe(
       debounceTime(200),
       map(term => term === '' ? []
         : statesWithFlags.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
     )
 
   formatter = (x: {name: string}) => x.name;

  // toggle sidebar in small devices
  toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }

  // toggle sidebar
  toggleSidebar() {
    let body = document.querySelector('body');
    if((!body.classList.contains('sidebar-toggle-display')) && (!body.classList.contains('sidebar-absolute'))) {
      this.iconOnlyToggled = !this.iconOnlyToggled;
      if(this.iconOnlyToggled) {
        body.classList.add('sidebar-icon-only');
      } else {
        body.classList.remove('sidebar-icon-only');
      }
    } else {
      this.sidebarToggled = !this.sidebarToggled;
      if(this.sidebarToggled) {
        body.classList.add('sidebar-hidden');
      } else {
        body.classList.remove('sidebar-hidden');
      }
    }
  }

  // toggle right sidebar
  // toggleRightSidebar() {
  //   document.querySelector('#right-sidebar').classList.toggle('open');
  // }
 
  path : string;
  notifications : Notification[] = [];
  test : string;
  notUserPath = "https://localhost:44342/";
  private hubConnection: signalR.HubConnection
 baseUrl: string = "https://localhost:44342/"
  dateNow : Date = new Date();
  readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  today : string;
users: any;
private _subscription: PushSubscription;
public operationName: string;
toggled = false;
public navbarCollapsed = true;
newNotNumber = 0;
isAdmin : boolean = false;
 
User : user;
ngOnInit() {
  this.test = this.dateNow.toString();
  var today = (new Date()).getDay();
  this.http.get("https://localhost:44342/api/getAllUsers", {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  }).subscribe(response => {
    this.users = response;
  }, err => {
    console.log(err)
  });
  let token = localStorage.getItem("token");
  let tokenObj = JSON.stringify((this.jwtHelper.decodeToken(token)));
  console.log(tokenObj);
  let s = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
  let tokenName = JSON.parse(tokenObj);
  let userName =  tokenName['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
  this.getUser(userName).subscribe(p =>
    {
      debugger;
      // alert("Welcome " + p.firstName + "  "+ p.lastName)
      this.path = "https://localhost:44342/" +  p.profileUrl;
      this.User = p;
      console.log(this.path);
    })
    
      // this.http.get(this.baseUrl + 'api/PublicKey', { responseType: 'text' }).subscribe(publicKey => {      
      //       console.log(publicKey);
      //   this.swPush.requestSubscription({
      //     serverPublicKey: publicKey
      //   })
      //     .then(subscription => this.http.post(this.baseUrl + 'api/PushSubscriptions', subscription, this.httpOptions).subscribe(res => {console.log(res) },
      //       error => console.error(error)
      //     ))
      //     .catch(error => console.error(error));
      // }, error => console.error(error));
      // debugger;
      // this.router.events.subscribe(e => {
      //   if (e instanceof ActivationStart && e.snapshot.outlet === "Dashboard")
      //     this.outlet.deactivate();
      // });
      this.startConnection(userName);
      this.addTransferChartDataListener();
     this.getAllNot();
     this.isAdmin = this.userService.getUserRole();
    //this.newNotNumber = this.notifications.length;
    };

  //  operation() {
  //   (this._subscription === null) ? this.subscribe() : this.unsubscribe(this._subscription.endpoint);
  // };


  // private subscribe() {
  //   this.http.get(this.baseUrl + 'api/PublicKey', { responseType: 'text' }).subscribe(publicKey => {
  //     this.swPush.requestSubscription({
  //       serverPublicKey: publicKey
  //     })
  //       .then(subscription => this.http.post(this.baseUrl + 'api/PushSubscriptions', subscription, this.httpOptions).subscribe(
  //         () => { },
  //         error => console.error(error)
  //       ))
  //       .catch(error => console.error(error));
  //   }, error => console.error(error));
  // };

  // private unsubscribe(endpoint) {
  //   this.swPush.unsubscribe()
  //     .then(() => this.http.delete(this.baseUrl + 'api/PushSubscriptions/' + encodeURIComponent(endpoint)).subscribe(
  //       () => { },
  //       error => console.error(error)
  //     ))
  //     .catch(error => console.error(error));
  // }
data: any;
getUser (userName) : Observable<any>
{
  return  this.http.get("https://localhost:44342/api/getUserInfo?id=" + userName, {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  });
}
  
getAllNot()
{
  this.notService.getAllNotifications().subscribe(data => {
    console.log(data);
      this.notifications = data;
     this.newNotNumber = this.getNewNotNumber(this.notifications);
     console.log(this.newNotNumber)
     if(this.newNotNumber >  0)
     this.newNote = true;
    })
}
  getNewNotNumber(data : Notification[])
  {
    debugger;
    let count = 0;
    data.forEach(element => {
      if(element.opened === false)
      {
        count++;
      }
    });
  return  count;
  }
  onToggle()
  {
    console.log(this.toggled);
    this.toggled = !this.toggled;
    console.log(this.toggled);
  }
  isRotate = 'open';

  emptynotifications()
  {
  this.notService.openNotifications().subscribe(p =>
    {
      console.log(p);
      this.getAllNot;
    })
    this.newNot = false;
  }
  onClick()
  {
    console.log("test");
    this.navbarCollapsed = !this.navbarCollapsed 
  }
  logOut()
  {
    debugger;
    localStorage.removeItem('token');
    this.router.navigate(['LogIn'])

  }
  newNote : boolean = false;
  public startConnection = (userId) => {
    let token = localStorage.getItem("token");
    let tokenObj = JSON.stringify((this.jwtHelper.decodeToken(token)));
      this.hubConnection = new signalR.HubConnectionBuilder()
                              .withUrl('https://localhost:44342/NotificationUserHub?userId=' + userId,
                              {
                                skipNegotiation: true,
                                transport: signalR.HttpTransportType.WebSockets,
                                accessTokenFactory: () => token ,
                              })
                              .build();
      this.hubConnection
        .start()
        .then(() => this.hubConnection.invoke('GetConnectionId')
        .then(function (connectionId) {
            // Send the connectionId to controller
            console.log(connectionId);
        }))
        .catch(err => console.log('Error while starting connection: ' + err))

       
    }
    public addTransferChartDataListener = () => {
      this.hubConnection.on('sendToSpecificUser', (data) => {
        this.notifications = data;
        this.newNot = true;
       // this.newNotNumber = this.notifications.length;
        console.log("Hub Data :" + data);
        this.getAllNot();
      });
      this.hubConnection.on('userDeactivated', (data) => {
        localStorage.removeItem('token');
        // window.location.reload();

      });

    }

    openNotification(data : any)
    {
      // data = '5102af10-5090-49ff-7733-08d85ef3ccc8';
      this.notService.readNotification(data).subscribe(p=>
        {
          this.getAllNot()
        }
        )
      this.router.navigate(['Dashboard/taskinfo',data])
    }
}
