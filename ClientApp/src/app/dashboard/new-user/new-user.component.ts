import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { UserLoginServiceService } from '../../Services/user-login-service.service';
import { NgxSpinnerService } from "ngx-spinner";

export interface teamRoles 
{
  id : string;
  name : string
}
export interface User 
{
      FirstName : string;
      LastName : string;
      Email  : string;
      Address : string;
      Position : string;
      phoneNumber : string;
      about : string;
      password : string;
      teamRoleId : string;
      createdBy : string;
}
@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  teamRoles : teamRoles[] = 
  [
    {
      id : "673025c0-0c55-494c-9e7d-08d83aba6817",
      name : "Member"
    },
    {
      id : "988c3254-df32-4159-af1b-08d83d32805b",
      name : "Team Leader"
    },
    {
      id : "6f01c429-e2d7-4add-1d67-08d83d37c8cd",
      name : "Team Admin"
    }
  ]
  constructor( private formBuilder: FormBuilder,private userService : UserLoginServiceService , private spinner : NgxSpinnerService
    ) { }
   public createUserForm : any;
   public user : User ;
  ngOnInit() {
    this.createUserForm = this.formBuilder.group({
      first_name: '',
      last_name: '',
      email : '',
      Address : '',
      Position : '',
      phone : '',
      about : '',
      password : '',
      status : ''

    });
  }
  createUser(data : any)
  {
    debugger;
    let LoggedUserId = this.userService.getUserId();
    this.spinner.show();
    let user : User = {
      FirstName : data.first_name,
      LastName : data.last_name,
      Email : data.email,
      Address : data.Address,
      Position : data.Position,
      phoneNumber : data.phone,
      about : data.about,
      password : data.password,
      teamRoleId : data.status,
      createdBy : LoggedUserId
    }
    this.userService.createUser(user).subscribe(p => 
      {
        console.log(p);
        this.spinner.hide();
        this.createUserForm.reset();
      });
  }

}
