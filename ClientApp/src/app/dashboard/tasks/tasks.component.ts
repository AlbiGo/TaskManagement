import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { UserLoginServiceService } from "../../Services/user-login-service.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { TaskServiceService } from "../../Services/task-service.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ThemePalette } from "@angular/material/core";
import { Sort } from "@angular/material/sort";
import { MatSort } from "@angular/material/sort";
import { pipe } from "rxjs";
import { SelectionModel } from "@angular/cdk/collections";

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}
export interface task {
  tittle: string;
  description: string;
  project: string;
  user: string;
  category: string;
  priority: string;
  startDate: string;
  endDate: string;
  Status: string;
  Terminated: boolean;
  progress: number;
}

interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: "app-tasks",
  templateUrl: "./tasks.component.html",
  styleUrls: ["./tasks.component.scss"],
})
export class TasksComponent implements OnInit {
  foods: Food[] = [
    { value: "steak-0", viewValue: "Task" },
    { value: "pizza-1", viewValue: "Bug" },
    { value: "tacos-2", viewValue: "Feature" },
  ];
  task: Task = {
    name: "Indeterminate",
    completed: false,
    color: "primary",
    subtasks: [{ name: "Primary", completed: false, color: "primary" }],
  };
  constructor(
    private userService: UserLoginServiceService,
    private taskServie: TaskServiceService,
    private spinner: NgxSpinnerService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selection = new SelectionModel<any>(true, []);
  toppings = new FormControl();
  toppingList: string[] = [
    "Extra cheese",
    "Mushroom",
    "Onion",
    "Pepperoni",
    "Sausage",
    "Tomato",
  ];
  isAdmin: boolean = false;
  users: any;
  displayedColumns = [
    "select",
    "TaskName",
    "Title",
    "Progres",
    "assignedTo",
    'Area',
    "createdOn",
    "deadline",
    "delete",
  ];
  dataSource: any;
  clicked = false;
  color = "primary";
  mode = "determinate";
  value = 50;
  selectedTaskId: any;
  bufferValue = 75;
  public isActive: boolean = false;
  taskSelected: boolean = false;
  loggedUserID: string = "";

  filteres : taskFilteres = {
    userIDs : [] ,
    status : []
  };
  

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }

    if (this.selection.isSelected(row)) {
      debugger;
      this.taskSelected = true;
      return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
        row.position + 1
      }`;
    } else {
      this.taskSelected = false;
    }
  }


  deleteTask(data: any) {
    this.spinner.show();
    this.taskServie.deleteTask(data).subscribe((p) => {
      this.taskServie.getAllTasks().subscribe((p) => {
        setTimeout(() => {
          console.log(p);
          this.dataSource = new MatTableDataSource(p);
          this.dataSource.paginator = this.paginator;
          this.selection.clear();
          this.spinner.hide();
        });
      });
      this.taskSelected = false;
    });
  }

  sortData(sort: Sort) {
    debugger
    this.spinner.show();
    console.log(sort);
    console.log("UserIds " + this.userIds);
    let column = sort.active;
    let dir = sort.direction;
    this.taskServie.sortTasks(column, dir ,this.filteres).subscribe((p) => {
      setTimeout(() => {
        console.log(p);
        this.dataSource = new MatTableDataSource(p);
        this.dataSource.paginator = this.paginator;
        console.log(this.dataSource);
        this.spinner.hide();
      });
    });
  }

  search(event: any) {
    this.spinner.show();
    let values = "";
    console.log((values += event.target.value));
    if (values === "") {
      this.taskServie.getAllTasks().subscribe((p) => {
        setTimeout(() => {
          console.log(p);
          this.dataSource = new MatTableDataSource(p);
          this.dataSource.paginator = this.paginator;
          console.log(this.dataSource);
          this.spinner.hide();
        });
      });
    } else {
      this.taskServie.getTaskByTitle(values).subscribe((p) => {
        this.dataSource = new MatTableDataSource(p);
        this.dataSource.paginator = this.paginator;
        this.spinner.hide();
      });
    }
  }

  getAlltasks() {
    this.spinner.show();
    this.taskServie.getAllTasks().subscribe((p) => {
      setTimeout(() => {
        console.log(p);
        this.dataSource = new MatTableDataSource(p);
        this.dataSource.paginator = this.paginator;
        this.spinner.hide();
      });
    });
  }



  ngOnInit() {
    
    this.getAlltasks();
    this.userService.getAllUsers2().subscribe((data) => {
      console.log(data);
      this.users = data;
    });
    this.isAdmin = this.userService.getUserRole();
    this.loggedUserID = this.userService.getUserId();
  }



  userstatus: number[] = [];
  newArrayStatus: Task[] = [];
  countTrueStatus: number = 0;
  countFalseStatus: number = 0;
  isCheckedStatus: boolean = false;
  array: Task[] = [];

  onChangeStatus(event , data)
  {
    console.log(event)
    this.userstatus.push(data);
    // this.isActive = !this.isActive;
    console.log(event);
    debugger;
    if (event.checked === true) {
      this.isCheckedStatus = true;
      this.countTrueStatus++;
      let statusFilteres = JSON.stringify(this.userstatus);
      this.filteres.status = this.userstatus;
      this.taskServie.getTaskByUser(this.filteres).subscribe((p) => {
        this.dataSource == null;
        debugger;
        this.newArrayStatus = p;
        this.array = this.array.concat(this.newArrayStatus);
        if (this.userstatus.length == 1 && this.newArrayStatus.length == 0) {
          this.array = [];
        }
        this.dataSource = new MatTableDataSource(this.array);
        this.dataSource.paginator = this.paginator;
 

      }); // this.dataSource.paginator = this.paginator;
    } else
     {
      this.countFalseStatus++;
      this.array = [];
      this.userstatus = this.userstatus.filter((item) => item !== data);
      // let statusFilteres = JSON.stringify(this.userstatus);
      this.filteres.status = this.userstatus;
      this.taskServie.getTaskByUser(this.filteres).subscribe((p) => {
        console.log(p);
        this.array = p;
        this.dataSource = new MatTableDataSource(p);


      });
    }
    if (this.countFalseStatus === this.countTrueStatus) {
      this.taskServie.getTaskByUser(this.filteres).subscribe((p) => {
        console.log(this.paginator);
        this.dataSource = new MatTableDataSource(p);
        this.dataSource.paginator = this.paginator;
        this.countFalseStatus = 0;
        this.countTrueStatus = 0;
        this.userstatus = [];
        this.array = [];
        this.isCheckedStatus = false;
        let statusFilteres = JSON.stringify(this.userstatus);
        this.filteres.status = this.userstatus;

      });
    }
  }

  
  getServerData(data) {
    console.log(data);
  }



  userIds: string[] = [];
  newArray: Task[] = [];
  countTrue: number = 0;
  countFalse: number = 0;
  isChecked: boolean = false;
  onChange(event, id) {
    this.userIds.push(id);
    // this.isActive = !this.isActive;
    console.log(event);
    debugger;
    if (event.checked === true) {
      this.isChecked = true;
      this.countTrue++;
     let statusFilteres = JSON.stringify(this.userIds);
      this.filteres.userIDs = this.userIds;
    }
    else{
      this.countFalse++;
      this.array = [];
      this.userIds = this.userIds.filter((item) => item !== id);
      let statusFilteres = JSON.stringify(this.userIds);
      this.filteres.userIDs = this.userIds; 
    }
    if (this.countFalse === this.countTrue) {
      debugger
      this.taskServie.getTaskByUser(this.filteres).subscribe((p) => {
        console.log(this.paginator);
        this.dataSource = new MatTableDataSource(p);
        this.dataSource.paginator = this.paginator;
        this.countFalse = 0;
        this.countTrue = 0;
        this.userIds = [];
        this.array = [];
        this.isChecked = false;
        let statusFilteres = JSON.stringify(this.userIds);
        this.filteres.userIDs = this.userIds;
      });
    }
    if(this.countTrue > this.countFalse)
    {
      this.taskServie.getTaskByUser(this.filteres).subscribe((p) => {
        this.dataSource == null;
        debugger;
        this.newArray = p;
        this.array = this.array.concat(this.newArray);
        if (this.userIds.length == 1 && this.newArray.length == 0) {
          this.array = [];
        }
        this.dataSource = new MatTableDataSource(this.array);
        this.dataSource.paginator = this.paginator;
      

      });
     } // this.dataSource.paginator = this.paginator;
     else if(this.countFalse > this.countTrue)
     {
     
      this.taskServie.getTaskByUser(this.filteres).subscribe((p) => {
        console.log(p);
        this.array = p;
        this.dataSource = new MatTableDataSource(p);
        this.dataSource.paginator = this.paginator;
       
        });
    }
    
  }
}

export interface taskFilteres {
  userIDs: string[];
  status : number[];
}
