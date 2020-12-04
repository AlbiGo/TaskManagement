import { Component, OnInit } from '@angular/core';
import {UserLoginServiceService} from '../Services/user-login-service.service'
import { FormBuilder } from '@angular/forms';
import { User } from '../Services/user';
import {Router} from '@angular/router'
import { NgxSpinnerService } from "ngx-spinner";  
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {SignalRService} from '../Services/signal-r.service'
@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {
  loginForm : any;
  constructor(
    private loginService : UserLoginServiceService,
    private formBuilder: FormBuilder,
    private router : Router,
    private spinner : NgxSpinnerService,
    private http : HttpClient,
    private signalR : SignalRService

  ) { 
    this.loginForm = this.formBuilder.group({
      username: '',
      password: ''
    });
  }
  message = ''
  loginError = false;;
   login(loginData : any)
  {
    debugger;
    this.spinner.show();
    let user : User = 
    {
       Password : loginData.password,
       Username : loginData.username,
       RememberMe : false
    };
     this.http.post("https://localhost:44342/api/Login", user, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    }).subscribe(response => {
      debugger;
      console.log(response);
      const token = (<any>response).token;
      localStorage.setItem("token", token);
      this.loginError = false;
      this.spinner.hide;
      //this.signalR.startConnection();
      this.router.navigate(["/dashboard"]);
    }, err => {
      debugger;
      console.log(err['statusText']);
      if(err.error['status'] === 401)
      {
        this.message = "Invalid Username or Password";
      }
      if(err.status === 500)
      {
        this.message = err['statusText'];
      }
      else{
        this.message = err['statusText'];

      }
      this.loginError = true;
      this.spinner.hide();

    }
    );      
    }    

  
  ngOnInit() {

  }

}
