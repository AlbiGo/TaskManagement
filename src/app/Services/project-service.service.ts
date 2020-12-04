import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {ProjectDetails} from './project-details'
import {projectDetails} from './project-details-mock-data'
import {MessageService} from './message.service'
@Injectable({
  providedIn: 'root'
})

export class ProjectServiceService {

  constructor(private messageService: MessageService) { }

  getProjectDetails(): Observable<ProjectDetails[]> {
    // TODO: send the message _after_ fetching the heroes
    this.messageService.add('HeroService: fetched heroes');
    return of(projectDetails);
  }

  getProject(id: number | string) : Observable<ProjectDetails>{
    console.log(id);
    return this.getProjectDetails().pipe(
      // (+) before `id` turns the string into a number
      map((projectDetails: ProjectDetails[]) => projectDetails.find(project => project.projectID == id))
    );
  }
}
