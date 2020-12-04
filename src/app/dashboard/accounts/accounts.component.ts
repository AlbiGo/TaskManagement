import { Component, OnInit,ViewChild } from '@angular/core';
import { UserLoginServiceService } from '../../Services/user-login-service.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { RouterOutlet, Router, ActivationStart } from '@angular/router';

interface Department
{
  Name : string;
  projects : number;
  teamMembers : number;


}

const Departments : Department[] = 
[
  { 
    Name : 'Finance',
    projects : 2 ,
    teamMembers : 4
  },
  {    
  Name : 'Project Mng',
  projects : 3,
  teamMembers : 2},
  {   
   Name : 'Marketing',
  projects : 1 ,
  teamMembers : 4},
  { 
   Name : 'HR',
  projects : 2 ,
  teamMembers : 2}
]

interface Team {
  photo: string;
  name: string;
  Department: string;
  Role: string;
}

const teamMembers: Team[] = [
  {
    photo : 'download.jpg',
    name: 'John Doe',
    Department: 'Project Mng',
    Role: 'Manager',

  },
  {
    photo : 'download.jpg',
    name: 'John Doe',
    Department: 'Finance',
    Role: 'Assistant',

  },
  {
    photo : 'download.jpg',

    name: 'John Doe',
    Department: 'Marketing',
    Role: 'Director',

  },
  {
    photo : 'download.jpg',

    name: 'John Doe',
    Department: 'Social Media',
    Role: 'Manager',

  },
  {
    photo : 'download.jpg',

    name: 'John Doe',
    Department: '',
    Role: 'President',

  }
];
@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(RouterOutlet, {static: true}) outlet: RouterOutlet;
  displayedColumns: string[] = ['photo', 'name', 'email', 'Role' , 'createdOn', 'status' ,'Actions'];
  constructor(
    private userService : UserLoginServiceService,
    private router: Router

  ) { }
  public dataSource: any;
  isAdmin : Boolean;
  public dataSourceDep: any;
  selectedTaskId : any;
  ngOnInit() {
    debugger;
    // this.dataSource = teamMembers;
    this.userService.getAllUsers2().subscribe(p =>
      {
        this.dataSource = new MatTableDataSource(p);
        this.dataSource.paginator = this.paginator;
        console.log(p)
      })
    this.dataSourceDep = Departments;
    this.isAdmin = true;

  }
  createUserImage= (serverPath: string) => {
       return `https://localhost:44342/${serverPath}`;
      }
      test : boolean = false
  addColumn()
  {
    this.displayedColumns.push("address");
    this.test = true;
  }
  applyFilter(data: any)
  {

  }

}
