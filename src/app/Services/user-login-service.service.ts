import { Injectable } from '@angular/core';
import {Users} from './user-mock-data';
import {User} from './user';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {CanActivate , Router} from "@angular/router";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class UserLoginServiceService {

  constructor(private router : Router , private http : HttpClient ,
    private jwtHelper : JwtHelperService 
    ) { }
  getAllUsers(): Observable<User[]> {
    // TODO: send the message _after_ fetching the heroes
    return of(Users);
  }

  getAllUsers2() : Observable<any>
  {
    return this.http.get("https://localhost:44342/api/getAllUsers" , {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        }) });
  }
  getAllActiveUsers() : Observable<any>
  {
    return this.http.get("https://localhost:44342/api/getAllActiveUsers" , {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        }) });
  }
  invalidLogin = true;
  // async login(userLogin : User) : Promise<any>{
  // debugger;
  // await this.http.post("https://localhost:44342/api/Login", userLogin, {
  //   headers: new HttpHeaders({
  //     "Content-Type": "application/json"
  //   })
  // }).subscribe(response => {
  //   debugger;
  //   console.log(response);
  //   const token = (<any>response).token;
  //   localStorage.setItem("token", token);
  //   this.invalidLogin = false;
  //   this.router.navigate(["/Dashboard"]);
  // }, err => {
  //   this.invalidLogin = true;
  // });
  // }

getUserId() : string
{
  let token = localStorage.getItem("token");
  let tokenObj = JSON.stringify((this.jwtHelper.decodeToken(token)));
  console.log(tokenObj);
  let s = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
  let tokenName = JSON.parse(tokenObj);
  let userName =  tokenName['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
  return userName;
}

getUserById(userId : any) : Observable<any>
{
  
  return  this.http.get("https://localhost:44342/api/getUserById?id=" + userId, {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  });
}

  getUser () : Observable<any>
{
  let token = localStorage.getItem("token");
  let tokenObj = JSON.stringify((this.jwtHelper.decodeToken(token)));
  console.log(tokenObj);
  let s = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
  let tokenName = JSON.parse(tokenObj);
  let userName =  tokenName['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
  return  this.http.get("https://localhost:44342/api/getUserInfo?id=" + userName, {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  });
}

getUserRole() : boolean
{
  let token = localStorage.getItem("token");
  let tokenObj = JSON.stringify((this.jwtHelper.decodeToken(token)));
  console.log(tokenObj);
  let tokenName = JSON.parse(tokenObj);
  let role =  tokenName['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  let bool : boolean = false; 
  if(role === 'admin' || role === 'superadmin')
  {
    bool = true;
  }
  return bool;

}
createUser(data : any) : Observable<any>
{
  return this.http.post("https://localhost:44342/api/createUser" , data,{
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        }) });
}

updateUser(data : any) : Observable<any>
{
  return this.http.put("https://localhost:44342/api/UpdateUser" , data,{
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        }) });
}
changePassword(data : any) : Observable<any>
{
  debugger;
  return this.http.post("https://localhost:44342/api/ChangePassord" , data,{
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        }) });
}
DeactivateUser(data : string) : Observable<any>
{
  debugger;
  return this.http.post("https://localhost:44342/api/DeactivateUser?id=" + data,{
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        }) });
}
Deleteuser(data : any) : Observable<any>
{
  debugger;
  return this.http.delete("https://localhost:44342/api/Deleteuser?id=" + data)
}
}