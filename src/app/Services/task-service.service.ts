import { Injectable } from '@angular/core';
import {Users} from './user-mock-data';
import {User} from './user';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {CanActivate , Router} from "@angular/router";
import { HttpClient,HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  constructor(private router : Router , private http : HttpClient ) { }

  getAllTasks() : Observable<any>
  {
    return this.http.get("https://localhost:44342/api/getAllTaskS")
  }
  sortTasks(column : string,dir:string , filters : taskFilteres) : Observable<any>
  {
    const options = {
      method: 'GET',
      headers: {
          'Content-Type':'string'
      }
  };
     debugger;

     let queryParams = '';
// if(filters.userIDs.length === 0 && filters.status.length == 0 )
// {
//   return this.http.get("https://localhost:44342/api/getAllTaskS");
// }
     var body = JSON.stringify(filters);
      let i = 0;
     filters.userIDs.forEach(element => {
      queryParams += 'userIDs['+i+']='+element+'&'
      i++;
       
     });
     i = 0;
     filters.status.forEach(element => {
      queryParams += 'status['+i+']='+element+'&'
      i++;
       
     });
     queryParams = '?' + queryParams.slice(0 , queryParams.length-1)
     console.log(queryParams)

    return this.http.get("https://localhost:44342/api/sortTasks?column=" +column+"&dir=" + dir + "&filters="+filters )
  }
  getTaskById(id : any) : Observable<any>
  {
    return this.getAllTasks().pipe(
      // (+) before `id` turns the string into a number
      map((tasks: any[]) => tasks.find(p => p.id == id))
    );
  }
  getTaskByUser(filters : taskFilteres) : Observable<any>
  {
    
    const options = {
      method: 'GET',
      headers: {
          'Content-Type':'string'
      }
  };
     debugger;

     let queryParams = '';
if(filters.userIDs.length === 0 && filters.status.length == 0 )
{
  return this.http.get("https://localhost:44342/api/getAllTaskS");
}
     var body = JSON.stringify(filters);
      let i = 0;
     filters.userIDs.forEach(element => {
      queryParams += 'userIDs['+i+']='+element+'&'
      i++;
       
     });
     i = 0;
     filters.status.forEach(element => {
      queryParams += 'status['+i+']='+element+'&'
      i++;
       
     });
     queryParams = '?' + queryParams.slice(0 , queryParams.length-1)
     console.log(queryParams)

    return this.http.get('https://localhost:44342/api/filterTasks'+queryParams, options)
  }

  downloadFile(serverPath): any {
		return this.http.get('https://localhost:44342' + serverPath, {responseType: 'blob'});
  }
  getUserTasks(userID)  : Observable<any>
  {
    return this.http.get("https://localhost:44342/api/getUserTasks?userID=" +userID )
  }
  getTaskByStatus(status : any) : Observable<any>
  {
    console.log(status)
    debugger;
    let params = new HttpParams();
    params = params.append('userIds', status.join(', '));
    return this.http.get("https://localhost:44342/api/getTaskByStatus" , { params: params })
  }

  getTaskByTitle(title : any) : Observable<any>
  {
    return this.http.get("https://localhost:44342/api/getTasksbyTitle?title=" + title)

  }
  createTask(Data : any) : Observable<any>
  {
    console.log(Data);
    return this.http.post("https://localhost:44342/api/createTask", Data, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    })
  }
  saveTask(Data : any) : Observable<any>
  {
    console.log(Data);
    return this.http.put("https://localhost:44342/api/updateTask", Data, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    })
  }

  reactivateTask(tasktitle)
  {
    console.log(tasktitle)
    return this.http.post("https://localhost:44342/api/reactivateTask?taskId=" + tasktitle, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    })
  }
  resolveTask(tasktitle)
  {
    console.log(tasktitle)
    return this.http.post("https://localhost:44342/api/resolveTask?tasktitle=" + tasktitle, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    })
  }
  CancelTask(tasktitle)
  {
    console.log(tasktitle)
    return this.http.post("https://localhost:44342/api/cancelTask?tasktitle=" + tasktitle, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    })
  }
  reject(tasktitle , comment)
  {
    console.log(tasktitle)
    return this.http.post("https://localhost:44342/api/rejectTask?tasktitle=" + tasktitle + "&comment=" + comment, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    })
  }
  deleteTask(taskId)
  {
    return this.http.delete("https://localhost:44342/api/deleteTask?taskid=" + taskId ,{
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    })
  }
  getAllComments(id:string) : Observable<any>
  {
    return this.http.get("https://localhost:44342/api/getAllComments?taskId=" + id ,{responseType: 'text'}
    )

  }
  addDocumment(taskid , comment)
  {
    console.log(taskid)
    return this.http.post("https://localhost:44342/api/addCommentToTask?taskID=" + taskid + "&commnet=" + comment, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    })
  }

  getActiveTasks() : Observable<any>
  {
    return this.http.get("https://localhost:44342/api/getActiveTsks" , {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    } )
  }
}
export interface task
{
  tittle  : string,
  description : string,
  project : string,
  user : string,
  category : string,
  priority : string,
  startDate : string,
  endDate : string,
  Status : string,
  Terminated : boolean
  progress : number,
}

export interface taskFilteres {
  userIDs: string[];
  status : number[];
}
