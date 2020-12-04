import { Component, OnInit,ViewChild,ViewChildren,QueryList  } from '@angular/core';
import { UserLoginServiceService } from '../../Services/user-login-service.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { TaskServiceService } from '../../Services/task-service.service';
import { RouterOutlet, Router, ActivatedRoute,ActivationStart } from '@angular/router';
import { NotificationServiceService } from '../../Services/notification-service.service';
import { FormBuilder,Validators ,FormGroup  } from '@angular/forms';
import { Validator,  NG_VALIDATORS } from '@angular/forms';  
import { TmplAstBoundText } from '@angular/compiler';
import { NgxSpinnerService } from "ngx-spinner";
import {MatDialog} from '@angular/material/dialog';
import {Sort} from '@angular/material/sort';
export interface teamRoles 
{
  id : string;
  name : string
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  constructor(
    private userService : UserLoginServiceService ,   
    private taskServie : TaskServiceService, 
    private router : ActivatedRoute,
    private routerOutlet : Router,
    private notService :  NotificationServiceService,
    private builder : FormBuilder,
    private spinner : NgxSpinnerService,
    public dialog: MatDialog

  ) { }
  public dataSource: any;
  public dataSourceNot: any;
  userInfo : any;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  displayedColumns = [ 'TaskName', 'project', 'Progres' , 'createdOn','deadline' ];
  selectedTaskId : any;
  isAdmin : boolean = true;
  isActive : boolean = true;
  Notifications : any;
  userInfoForm : any;
  submitButton : boolean = false;
  changePass : boolean = false;
  changePasswordForm : any;
  displayedColumnsNotificaton = [ 'Notification','action' ];
  selected : any;
  submited : boolean = true;
  
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
  // get f() { return this.userInfoForm.controls; }

  createUserForm()
  {
      this.userInfoForm = this.builder.group({
        first_name: '',
        last_name: '',
        email: '',
        address: '',
        role: '',
        phone: '',
        description: ''
      }
     );
    
  }

  getUser()
  {
    debugger
    console.log(this.router)
    let id : string = this.router.params["value"].id ?? '';
    console.log(id);
    if(id !== "")
    {
      this.userService.getUserById(id).subscribe(p => 
        {               
          this.isAdmin = this.userService.getUserRole();
          this.userInfo = p;
          console.log(this.userInfo.isActive);
          if(!this.userInfo.isActive)
          {
            this.isActive = false;
          }
          this.selected = this.userInfo.teamRoleID;
          console.log(p)
          this.taskServie.getTaskByUser(this.userInfo.id).subscribe(p =>
            {
              console.log(p);
              this.dataSource = new MatTableDataSource(p);
              this.dataSource.paginator = this.paginator.toArray()[0];
              this.notService.getAllNot().subscribe(p =>
                {
                  this.dataSourceNot = new MatTableDataSource(p);
                  this.dataSourceNot.paginator = this.paginator.toArray()[1];
                  this.spinner.hide()
                })
             
            })
        })
    }
    else
    {
      this.userService.getUser().subscribe(p => 
        {               
          this.isAdmin = this.userService.getUserRole();
          this.userInfo = p;
          this.selected = this.userInfo.teamRoleID;
          console.log(p)
          this.taskServie.getTaskByUser(this.userInfo.id).subscribe(p =>
            {
              this.dataSource = new MatTableDataSource(p);
              this.dataSource.paginator = this.paginator.toArray()[0];
              this.notService.getAllNotifications().subscribe(p =>
                {
                  this.dataSourceNot = new MatTableDataSource(p);
                  console.log( this.paginator.toArray()[1])
                  this.dataSourceNot.paginator = this.paginator.toArray()[1];
                  this.spinner.hide()
                })
             
            })
        })
    }
  }

  ngOnInit() {
  this.createUserForm();
  this.getUser();
  console.log(this.userInfo.id)
     
     
  }
Save : boolean = false;
  onKey(data : any)
  {
    debugger;
    this.Save = true;
  }
  sortData(data : any)
  {
    
  }
showPasswordButton : boolean = false;
  checkPassword()
  {
    let loggedId = this.userService.getUserId();
    let id = this.userInfo.id;
    if(loggedId === id)
    {
      this.showPasswordButton = true;
    }
  }
saveUser(data : any)
{
  this.spinner.show();
debugger;
console.log(data)
let firstname = '';
if(data.first_name === '')
{
  firstname = this.userInfo.firstName
}
else 
{
  firstname = data.first_name;

}

let lastname = '';
if(data.last_name === '')
{
  lastname = this.userInfo.lastName
}
else 
{
  lastname = data.last_name;

}
let email = '';
if(data.email === '')
{
  email = this.userInfo.email
}
else 
{
  email = data.email;

}
let Address = '';
if(data.address === '')
{
  Address = this.userInfo.address
}
else 
{
  Address = data.address;

}

let phoneNumber = '';
if(data.phone === '')
{
  phoneNumber = this.userInfo.phoneNumber
}
else 
{
  phoneNumber = data.phone;

}

let Description = '';
if(data.description === '')
{
  Description = this.userInfo.description
}
else 
{
  Description = data.description;

}
console.log( data)
let user : User = {
  id : this.userInfo.id,
  FirstName : firstname,
  LastName : lastname,
  Email :email ,
  Address : Address,
  phoneNumber : phoneNumber,
  Description : Description
}
console.log( user)

this.userService.updateUser(user).subscribe(p => 
  {
    console.log(p);
    this.spinner.hide()
    this.getUser();
    
  });
}
createImagePath= (serverPath: string) => 
{
     return `https://localhost:44342/${serverPath}`;
}


changePasswordShow()
{
  debugger;
  this.changePass = true;
}
onKeyChangePassword()
{
  this.submitButton = true;
}

deactivateUser()
{
  let id = this.userInfo.id;
  let Loggedid = this.userService.getUserId();
  if(id === Loggedid )
  {
    const dialogRef =  this.dialog.open(ErrorDialogProfile);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  else{
    debugger;
    this.spinner.show();
    this.userService.DeactivateUser(id).subscribe(p =>
      {this.spinner.hide()});
  }
}
deleteUser()
{
  let id = this.userInfo.id;
  let Loggedid = this.userService.getUserId();
  if(id === Loggedid )
  {
    const dialogRef =  this.dialog.open(ErrorDialogProfile);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  else{
    debugger;
    this.spinner.show();
    this.userService.Deleteuser(id).subscribe(p =>
      {this.spinner.hide()
        this.routerOutlet.navigate(["Dashboard/manageTeam"]);

      });
  }
}
}
export interface User 
{
  id : string;
  FirstName : string;
  LastName : string;
  Address  : string;
  Description : string;
  phoneNumber : string;
  Email : string;
}

@Component({
  selector: 'error-dialog',
  templateUrl: 'error-dialog.html',
})
export class ErrorDialogProfile {}


