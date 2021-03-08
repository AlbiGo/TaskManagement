import { Injectable } from '@angular/core';
import {CanActivate , Router} from "@angular/router";
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private jwtHelper: JwtHelperService, private router: Router) { }
  canActivate() {
    const token = localStorage.getItem("token");

    if (token && !this.jwtHelper.isTokenExpired(token)){
      console.log(this.jwtHelper.decodeToken(token));
      return true;
    }
    this.router.navigate(["LogIn"]);
    return false;
  }
}
