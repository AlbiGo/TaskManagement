import {FormControl} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { startWith} from 'rxjs/operators';
import {Component, ViewChild ,OnInit}  from '@angular/core';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subject, merge} from 'rxjs';
import { distinctUntilChanged, filter, map} from 'rxjs/operators';
import {debounceTime} from 'rxjs/operators';
import { TaskServiceService } from '../../Services/task-service.service';
import { NgxSpinnerService } from "ngx-spinner";
import { UserLoginServiceService } from '../../Services/user-login-service.service';
import { HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';


export interface Task {
  TaskTitle: string;
  Description: string;
  ProjectId: string;
  Status: number;
  References: string;
  UserID: string;
  StartDate: string;
  Deadline: string;
  TaskPriority: number;
  TypeId : number;
  CreatedBy : string;
  TaskDocumentPath : string;
}
export interface User{
  firstName : string;
  lastName : string;
  email : string;
  Id : string;
}
@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  names : string[] = [];
  createTaskForm : any;
  filteredOptions: Observable<string[]>;
  formatter = (user: User) => user.firstName + ' '+ user.lastName + ' ';
  public startDatemodel: any;
  public deadlineModel: any;
  public assignModel: any;
  users : User[];
  isAdmin : boolean = false;
  
 
  constructor(
    private userService : UserLoginServiceService,
    private formBuilder: FormBuilder,
    private taskService : TaskServiceService,
    private spinner: NgxSpinnerService,
    private http : HttpClient


  ) {
    this.createTaskForm = this.formBuilder.group({
      taskTitle: '',
      project: '',
      assign : '',
      priority : '',
      startDate : '',
      deadLine : '',
      references : '',
      description : '',
      documentPath : ''
    });
   }

  ngOnInit() {
    // this.filteredOptions = this.myControl.valueChanges
    // .pipe(
    //   startWith(''),
    //   map(value => this._filter(value))
    // );
    this.userService.getAllActiveUsers().subscribe(p =>
      {
        this.users = p;    
        this.spinner.hide(); 
           // console.log(this.states);
      }
      )
      this.isAdmin = this.userService.getUserRole();

  
     
  }
  createTask(formData : any)
  {
    let createdBy = this.userService.getUserId();
    this.spinner.show();
     let userID = formData.assign.id;
     let intMonthDeadline = parseInt(formData.deadLine.month);
     let intDayDeadline = parseInt(formData.deadLine.day);
    let MonthDeadline = '';
    let dayDeadline = '';
    let day
     if(intMonthDeadline < 10)
     {
      MonthDeadline = '0' + formData.deadLine.month;
     }
     else{
      MonthDeadline = formData.deadLine.month;
     }
    if(intDayDeadline < 10)
    {
      dayDeadline = '0' + formData.deadLine.day;
    }
    else{
      dayDeadline = formData.deadLine.day;
    }
    let intMonthStartDate = parseInt(formData.startDate.month);
    let intDayStartDate = parseInt(formData.startDate.day);
   let MonthStartDate = '';
   let dayStartDate = '';
    if(intMonthStartDate < 10)
    {
      MonthStartDate = '0' + formData.startDate.month;
    }
    else{
      MonthStartDate = formData.startDate.month;
    }
   if(intDayStartDate < 10)
   {
    dayStartDate = '0' + formData.startDate.day;
   }
   else{
    dayStartDate = formData.startDate.day;
   }


    let Startdate = formData.startDate.year + '-' + MonthStartDate + '-' + dayStartDate ;
    let deadline = formData.deadLine.year + '-' + MonthDeadline + '-' + dayDeadline;

    console.log(userID);
    let newTask : Task = { 
      TaskTitle : formData.taskTitle,
      Description : formData.description,
      ProjectId : '2C070E5A-E14B-4D95-B549-E52AE5A96151',
      Status : 1,
      TypeId : 1,
      References : formData.references,
      UserID : userID,
      StartDate : Startdate,
      Deadline : deadline,
      TaskPriority : 1,
      CreatedBy : createdBy,
      TaskDocumentPath : this.documentPath
    };
console.log(newTask);
    this.taskService.createTask(newTask).subscribe(p=>
      {
        console.log("Result " + p);
        this.spinner.hide();
        this.createTaskForm.reset();

      },
      err => {
        this.spinner.hide();
        console.log(err);
        debugger;
      });


  }
  
 
  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.options.filter(option => option.toLowerCase().includes(filterValue));
  // }
  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.users
        : this.users.filter(user => user.firstName.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10) )
    );
  }
documentPath : string = '';
  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
 
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
 
    this.http.post('https://localhost:44342/api/addDocumentToTask', formData, {reportProgress: true, observe: 'events'})
      .subscribe(event => {
      
        if (event.type === HttpEventType.UploadProgress)
        {
          // this.progress = Math.round(100 * event.loaded / event.total);
    
      }
        else if (event.type === HttpEventType.Response) {
          // this.message = 'Upload success.';
          // this.onUploadFinished.emit(event.body);
          let res = event['body'];
          let path = res['dbPath'];
          this.documentPath = path;
          console.log(path)
          // this.seeDesign = true;
        }
  });

}


}
