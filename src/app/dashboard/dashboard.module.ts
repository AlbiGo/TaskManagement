import { NgModule } from '@angular/core';
// import {DashboardRoutingModule} from './dashboard-routing.module'
// import {
//   MatButtonModule, MatMenuModule, MatDatepickerModule,MatNativeDateModule ,
//   MatIconModule, MatCardModule, MatSidenavModule,MatFormFieldModule,
//   MatInputModule, MatTooltipModule, MatToolbarModule  ,MatBadgeModule,MatSortModule
// } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {FormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects/projects.component';
// declare var angular: any;
// angular.module('OrganisationManagement', ['ngAnimate'])
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatSortModule} from '@angular/material/sort';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatBadgeModule} from '@angular/material/badge';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ChartsModule, ThemeService } from 'ng2-charts';
// import { NgbdDatepickerPopup } from './';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import {MatDialogModule} from '@angular/material/dialog';
import { NgxSpinnerModule } from "ngx-spinner";
import {MatChipsModule} from '@angular/material/chips';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatStepperModule} from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { TasksComponent } from './tasks/tasks.component';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ServiceWorkerModule } from '@angular/service-worker';
// import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NewTaskComponent } from './new-task/new-task.component';
import { TaskInfoComponent } from './task-info/task-info.component';
import { TeamComponent } from './team/team.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { NewUserComponent } from './new-user/new-user.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component'
import { TodoComponent } from '../apps/todo-list/todo/todo.component';
import { TodoListComponent } from '../apps/todo-list/todo-list.component';
import {ErrorDialog} from './task-info/task-info.component';
import { DatePipe } from '@angular/common';
import { FeedComponent } from './feed/feed.component';
import { AccountsComponent } from './accounts/accounts.component';

@NgModule({
  declarations: [
  ProjectsComponent,
  TasksComponent,
  NewTaskComponent,
  TaskInfoComponent,
  TeamComponent,
  UserProfileComponent,
  ProjectDetailsComponent,
  NewProjectComponent,
  NewUserComponent,
  DashboardHomeComponent,
  TodoComponent,
  TodoListComponent,
  ErrorDialog,
  FeedComponent,
  AccountsComponent


],
  imports: [
    // DashboardRoutingModule,
    MatButtonModule,
    MatStepperModule,
    ReactiveFormsModule,
    ChartsModule,
    MatIconModule,
    DashboardRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: true}),
    FormsModule,
    NgbCollapseModule,
    MatDialogModule,
    NgxSpinnerModule,
    ButtonsModule.forRoot(),
    MatInputModule,
    MatSelectModule,
    CommonModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatCardModule,
    MatSortModule,
    MatTooltipModule,
    MatBadgeModule,
    MatAutocompleteModule,
    MatTableModule,
    MatChipsModule,
    MatFormFieldModule,
    NgbDatepickerModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatPaginatorModule,
    NgbModule

  ],
  providers: [ { provide: MAT_DIALOG_DATA, useValue: [] } ,ThemeService],
  exports: [DatePipe],
  bootstrap: [],
  entryComponents: [ErrorDialog ]

})
export class DashboardModule { }
