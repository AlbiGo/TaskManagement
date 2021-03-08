import { Component, OnInit, Inject } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { TaskServiceService } from "../../Services/task-service.service";
import { FormControl } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { HttpRequest, HttpEventType, HttpResponse } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";
import { UserLoginServiceService } from "../../Services/user-login-service.service";
import * as fileSaver from "file-saver";
import { MatDialog, MatDialogConfig ,MatDialogRef ,MAT_DIALOG_DATA} from "@angular/material/dialog";
import { timeStamp } from "console";
import { DatePipe } from "@angular/common";
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
interface status {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.scss']
})
export class TaskInfoComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskServiceService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private userService: UserLoginServiceService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    public formatter: NgbDateParserFormatter,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    //  this.actualDate = this.datePipe.transform(this.actualDate, 'yyyy-MM-dd');
  }
  taskDetails: any;
  saveTaskForm: any;
  isAdmin: Boolean = false;
  designPath = "";
  dialogErrorMessage: string = "";
  seeDesign: boolean = true;
  search: any;
  fullname : string = "";
  startDatemodel: Date ;
  deadlineModel: Date | null;
  assignModel: any;
  Document: boolean = true;
  oldComments: string[] = [];
  daysLeft: any;
  dateNow: Date = new Date();
  isChecked: true;
  isAssignedToLoggedUser : boolean = true;
  isCompleted : boolean = false;
  taskStatus : number;
  statuses: status[] = [
    {value: 1, viewValue: 'Created'},
    {value: 2, viewValue: 'On Progess'},
    {value: 3, viewValue: 'Completed'},
    {value: 1002, viewValue: 'Resolved'},
    {value: 4, viewValue: 'Cancelled'}
  ];

  getTask(id: any) {
    debugger;
    this.taskService.getTaskById(id).subscribe((p) => {
      this.taskDetails = p;  
      console.log(this.taskStatus);
      debugger;
      this.taskStatus = this.statuses.find(p => p.value == this.taskDetails.status).value;
      this.fullname = this.taskDetails.user.firstName + " " + this.taskDetails.user.lastName;
      this.startDatemodel = new Date(this.taskDetails.createdOn) ;
      console.log(this.startDatemodel)
      if(this.taskDetails['status'] === 3)
      {
        this.isCompleted = true;
      }
      if (this.taskDetails.isActive === false) {
        this.disableForm();
        this.saveTaskForm.controls["status"].disable();
        this.saveTaskForm.controls["comment"].disable();
      } 
      else if (this.taskDetails.isActive === true) 
      {
        if (!this.isAdmin) {
          this.disableForm();
        }
          if (this.userService.getUserId() !== this.taskDetails.userID) {
            this.saveTaskForm.controls["status"].disable();
            this.saveTaskForm.controls["comment"].disable();
            this.isAssignedToLoggedUser = false;
          }
        
        // this.enableForm();
        // this.saveTaskForm.controls["status"].enable();
        // this.saveTaskForm.controls["comment"].enable();


      }

      if (
        this.taskDetails.designPath === "" ||
        this.taskDetails.designPath === null
      ) {
        this.seeDesign = false;
      }
      console.log(this.taskDetails.designPath);
      if (
        this.taskDetails.taskDocumentPath === "" ||
        this.taskDetails.taskDocumentPath === null
      ) {
        this.Document = false;
      }
      this.taskService
        .getAllComments(this.taskDetails.id)
        .subscribe((p: any) => {
          this.oldComments = p;
          console.log(this.oldComments);
        });
      console.log(this.dateNow);
      let deadline = new Date(this.taskDetails.deadline);
      let dateNow = this.dateNow.getDate();
      let dealineMonth = deadline.getMonth();
      let Difference_In_Time = deadline.getTime() - this.dateNow.getTime();
      Difference_In_Time = Difference_In_Time / (1000 * 3600 * 24); 
      Difference_In_Time = Math.round(Difference_In_Time);
      console.log(Difference_In_Time);
      this.daysLeft = "In " + Difference_In_Time + " days";
      console.log(Difference_In_Time);
      if(Difference_In_Time < 0)
      {
        this.daysLeft = "Passed";
      }
      if(Difference_In_Time == 0)
      {
        this.daysLeft = "Today"
      }
      if(this.taskDetails["isActive"] === false)
      {
        this.daysLeft = "Closed";
      }
      console.log(this.taskDetails.isActive);
      this.spinner.hide();
    });    
  }
  viewDesign()//Download Design
  {

  }
  canChangeStatus()//Only the assigned user can change the status
  {
    let loggedUser = this.userService.getUserId();
    let assignedUser = this.taskDetails['userID'];
    if(loggedUser !== assignedUser)
    {
      this.saveTaskForm.controls["status"].disable();
    }
  
  }
  ngOnInit() {
    debugger;
    let id = this.route.params["value"].id;
    if (id !== "" || id !== null) {
      this.createTaskForm();
      this.disableForm();
      this.spinner.show();
      this.saveTaskForm.controls["oldcomment"].disable();
     this.getTask(id);
      this.isAdmin = this.userService.getUserRole();
      let loggedUserid = this.userService.getUserId();
      debugger;
      console.log(this.isAdmin);
    }
  }
  createTaskForm() {
    this.saveTaskForm = this.formBuilder.group({
      taskTitle: "",
      project: "",
      assign: "",
      priority: "",
      startDate: "",
      deadLine: "",
      references: "",
      description: "",
      comment: "",
      status: "",
      oldcomment: "",
    });
  }

  resolveTask(data) {
    debugger;
    if (
      this.taskDetails["designPath"] === "" ||
      this.taskDetails["designPath"] === null
    ) {
      this.dialogErrorMessage = "This task is not completed.";
      const dialogRe = this.dialog.open(ErrorDialog, {
        data: { dialogErrorMessage: this.dialogErrorMessage },
      });
      return;
    }
    this.spinner.show();
    this.taskService.resolveTask(data).subscribe((p) => {
      this.getTask(data);
    });
  }
  cancelTask(data) {
    this.spinner.show();
    this.taskService.CancelTask(data).subscribe((p) => {
      this.taskService.getTaskById(this.taskDetails.id).subscribe((p) => {
        debugger;
        console.log(p);
        this.taskDetails = p;
        if (this.taskDetails.isActive === false) {
          this.disableForm();
          this.saveTaskForm.controls["status"].disable();
          this.saveTaskForm.controls["comment"].disable();
        }
        this.spinner.hide();
      });
    });
  }
  rejectTask(id) {
    debugger;
    if (
      this.taskDetails.comment === "" ||
      this.saveTaskForm.value.comment === ""
    ) {
      this.dialogErrorMessage = "Please enter a reason on comment section.";
      const dialogRe = this.dialog.open(ErrorDialog, {
        data: { dialogErrorMessage: this.dialogErrorMessage },
      });
    } else {
      this.spinner.show();
      this.taskService
        .reject(id, this.saveTaskForm.value.comment)
        .subscribe((p) => {
          this.taskService.getTaskById(this.taskDetails.id).subscribe((p) => {
            debugger;
            console.log(p);
            this.taskDetails = p;
            if (this.taskDetails.isActive === false) {
              //  this.disableForm()
            }
            this.spinner.hide();
          });
        });
    }
  }
  disableForm() {
    this.saveTaskForm.controls["priority"].disable();
    this.saveTaskForm.controls["startDate"].disable();
    this.saveTaskForm.controls["deadLine"].disable();
    this.saveTaskForm.controls["references"].disable();
    this.saveTaskForm.controls["description"].disable();
    this.saveTaskForm.controls["assign"].disable();
    this.saveTaskForm.controls["project"].disable();
    this.saveTaskForm.controls["taskTitle"].disable();
  }
  enableForm() {
    this.saveTaskForm.controls["priority"].enable();
    this.saveTaskForm.controls["startDate"].enable();
    this.saveTaskForm.controls["deadLine"].enable();
    this.saveTaskForm.controls["references"].enable();
    this.saveTaskForm.controls["description"].enable();
    this.saveTaskForm.controls["assign"].enable();
    this.saveTaskForm.controls["project"].enable();
    this.saveTaskForm.controls["taskTitle"].enable();
  }

  addComment(data: any) {
    debugger;
    this.spinner.show();
    console.log(data.comment);
    this.taskService
      .addDocumment(this.taskDetails.id, data.comment)
      .subscribe((p) => {
        console.log(p);
        this.getTask(this.taskDetails.id);
        console.log(this.oldComments);
        console.log(this.saveTaskForm.controls.oldcomment);
        this.spinner.hide();
        this.saveTaskForm.controls['comment'].reset();
      });
  }
  deleteTask(data) {
    this.spinner.show();
    this.taskService.deleteTask(data).subscribe((p) => {
      this.saveTaskForm.reset();
      this.spinner.hide();
      this.router.navigate(["Dashboard/tasks"]);
    });
  }
  saveTask(formData: any) {
    debugger;
    let status = "";
    if (formData.status === 3) {
      if (this.designPath === "" || this.designPath === null) {
        this.dialogErrorMessage =
          "You must upload a design to complete the task.";
        const dialogRe = this.dialog.open(ErrorDialog, {
          data: { dialogErrorMessage: this.dialogErrorMessage },
        });
        return;
      }
    }
    this.spinner.show();
    if (formData.status === "") {
      status = this.taskDetails.status;
    } else {
      status = formData.status;
    }
    let modifiedBy = this.userService.getUserId();

    this.spinner.show();
    let newTask: Task = {
      Id: this.taskDetails.id,
      TaskTitle: this.taskDetails.taskTitle,
      Description: this.taskDetails.description,
      ProjectId: "2C070E5A-E14B-4D95-B549-E52AE5A96151",
      References: this.taskDetails.references,
      UserID: this.taskDetails.userID,
      StartDate: this.taskDetails.startDate,
      Deadline: this.taskDetails.deadline,
      Priority: this.taskDetails.priority,
      CreatedBy: this.taskDetails.createdBy,
      designPath: this.designPath,
      Status: parseInt(status, 10),
      taskNumber: this.taskDetails.taskNumber,
      ModifiedBy: modifiedBy,
      commnet: this.taskDetails.comment,
    };
    this.taskService.saveTask(newTask).subscribe((p) => {
      console.log(p);
      this.getTask(this.taskDetails.id);
    }
    );
  }
  reactivateTask() {
    debugger;
    this.spinner.show();
    this.taskService.reactivateTask(this.taskDetails.id).subscribe((p) => {
      console.log(p);
      this.getTask(this.taskDetails.id);
      this.spinner.hide();
      });
  }

  public uploadFile = (files) => {
    debugger;
    this.spinner.show();
    console.log(files);
    if (files.length === 0) {
      return;
    }
    // const FileType = require('file-type');

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append("file", fileToUpload, fileToUpload.name);
    // (async () => {
    // console.log(await FileType.fromFile('Unicorn.png'));
    // //=> {ext: 'png', mime: 'image/png'}
    //   })();
    this.http
      .post("https://localhost:44342/api/addDesignToTask", formData, {
        reportProgress: true,
        observe: "events",
      })
      .subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          debugger;
          // this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          // this.message = 'Upload success.';
          // this.onUploadFinished.emit(event.body);
          debugger;
          let res = event["body"];
          let path = res["fileName"];
          console.log(path);
          this.designPath = path;
          console.log(path);
          this.spinner.hide();
        }
      });
  };

  createPath(serverPath) {
    debugger;
    console.log(serverPath);
    debugger;
    if (serverPath !== null) {
      let url = `https://localhost:44342/Assets/Designs/${serverPath}`;
      window.open(url, "_blank");
    }
  }

  openTaskDocument(serverPath) {
    debugger;
    serverPath = this.taskDetails.designPath;
    if (serverPath !== null) {
        this.taskService.downloadFile(serverPath).subscribe(response => {
          console.log(response)
          debugger
          const blob = new Blob([response], {
            type: 'application/zip'
          });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
      	}), error => console.log('Error downloading the file'),
                     () => console.info('File downloaded successfully'
        );

    }
  }

}
export interface comment {
  comment: string;
}

export interface Task {
  Id: string;
  TaskTitle: string;
  Description: string;
  ProjectId: string;
  Status: number;
  References: string;
  UserID: string;
  StartDate: string;
  Deadline: string;
  Priority: string;
  CreatedBy: string;
  designPath: string;
  taskNumber: string;
  ModifiedBy: string;
  commnet: string;
}

@Component({
  selector: "error-dialog",
  templateUrl: "error-dialog.html",
})
export class ErrorDialog {
  dialogErrorMessage: string = "";
  constructor(
    public dialogRef: MatDialogRef<ErrorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit() {
    this.dialogErrorMessage = this.data.dialogErrorMessage;
  }
}