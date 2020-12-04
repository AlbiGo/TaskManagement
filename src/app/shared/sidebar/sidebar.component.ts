import { Component, OnInit } from '@angular/core';
import { UserLoginServiceService } from '../../Services/user-login-service.service';
import {  JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public uiBasicCollapsed = false;
  public samplePagesCollapsed = false;
  users: any;
  path : string;
  User : any;

  constructor(
    private userService : UserLoginServiceService,
    private http : HttpClient,
    private jwtHelper : JwtHelperService 

  ) { }
  getUser (userName) : Observable<any>
  {
    return  this.http.get("https://localhost:44342/api/getUserInfo?id=" + userName, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    });
  }
  ngOnInit() {
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
      
    const body = document.querySelector('body');

    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    document.querySelectorAll('.sidebar .nav-item').forEach(function (el) {
      el.addEventListener('mouseover', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

}
