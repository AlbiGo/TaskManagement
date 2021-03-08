import { Component, OnInit ,ViewChild} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient,HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Sort} from '@angular/material/sort';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';

export interface Project{
  ID : number;
  projectName : string;
  projectDesc : string;
}
const projectData : Project[] = 
[
  {ID : 123 , projectName : 'Marketig Growth' ,projectDesc : 'Increase presence on social media.' },
  {ID : 123 , projectName : 'Marketig Growth' ,projectDesc : 'Increase presence on social media' },
  {ID : 123 , projectName : 'Marketig Growth' ,projectDesc : 'Increase presence on social media' }

]
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects : any;
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild(MatSort, {static: true}) sort: MatSort;
selection = new SelectionModel<any>(true, []);

  constructor(private htp : HttpClient) { }
  selectedProjectID : any;
  displayedColumns = ['select', 'TaskName', 'Title', 'client','Porgress', 'status' , 'assignedTo', 'createdOn','deadline','delete' ];
  dataSource : any;
  color = 'primary';
  taskSelected : boolean = false;

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
        
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    
    if(this.selection.isSelected(row))
    {
      debugger
      this.taskSelected = true;
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;

    }
    else{
      this.taskSelected = false;

    }
    
    
  }
  ngOnInit() {
    this.projects = projectData;
    this.htp.get("https://localhost:44342/api/getAllProjects").subscribe((p : any) =>
      {
        console.log(p);
        this.dataSource = new MatTableDataSource(p);
        this.dataSource.paginator = this.paginator;
        this.projects = p
      })
  }
  createDesignImage= (serverPath: string) => {
console.log(serverPath);
   return `https://localhost:44342/Assets/Designs/${serverPath}`;
  }
}
