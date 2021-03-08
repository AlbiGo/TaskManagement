import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UserLoginServiceService } from './user-login-service.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationServiceService {
  private API_URL= environment.API_URL;
  constructor(
    private http : HttpClient
  ) { }
getAllNotifications() : Observable<any>
{
  return this.http.get("https://localhost:44342/api/GetNotificationHubsByUser" , {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  } );
}
getAllNot() : Observable<any>
{
  return this.http.get("https://localhost:44342/api/getAllNot" , {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  } );
}



openNotifications() : Observable<any>
{
  return this.http.post("https://localhost:44342/api/readNotifications" , {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  });
}
readNotification(data : any) : Observable<any>
{
  return this.http.post(this.API_URL + "api/openNotification?id=" +  data, {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  });
}
}
