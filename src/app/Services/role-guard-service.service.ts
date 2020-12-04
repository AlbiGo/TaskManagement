import { Injectable } from '@angular/core';
import {CanActivate , Router} from "@angular/router";
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardServiceService implements CanActivate {

  constructor(private jwtHelper: JwtHelperService, private router: Router) { }
  canActivate() {
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
  else{
    this.router.navigate(["dashboard/home"]);
  }
  return bool;

  }
}
