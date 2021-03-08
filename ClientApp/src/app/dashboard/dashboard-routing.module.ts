import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { TeamComponent } from './team/team.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TasksComponent } from './tasks/tasks.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { TaskInfoComponent } from './task-info/task-info.component';
import {RoleGuardServiceService as RoleGuard } from '../Services/role-guard-service.service'
import {CanActivate , Router} from "@angular/router";
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component'
import { NewUserComponent } from './new-user/new-user.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { FeedComponent } from './feed/feed.component';
import { AccountsComponent } from './accounts/accounts.component';
import {RoleGuardSuperAdminService as SuperAdminGuard} from '../Services/super-admin-role-guard.service'
const routes: Routes = [ 

  {
    path : '',
    redirectTo :'home',
    pathMatch : 'full'
  },
  { path : 'projects' , component : ProjectsComponent},
  { path : 'feed' , component : FeedComponent},
  { path : 'home' , component : DashboardHomeComponent},
  { path : 'user' , component : UserProfileComponent},
  { path : 'accounts' , component : AccountsComponent ,canActivate: [SuperAdminGuard]},
  { path : 'newUser' , component : NewUserComponent , canActivate: [SuperAdminGuard]},
  { path : 'newProject' , component : NewProjectComponent , canActivate: [RoleGuard]},

//   { path: 'project/:id', redirectTo: 'projectDetails/:id' },
  { path : 'team' , component : TeamComponent},
//   { path : 'profile/:id' , component : UserProfileComponent},
//   { path : 'manageTeam/:id' ,redirectTo: 'profile/:id'},
  { path : 'tasks' , component : TasksComponent},
  { path : 'tasks/:id' , redirectTo: 'taskinfo/:id'},
  { path : 'taskinfo/:id' , component : TaskInfoComponent},
  { path : 'newTask' , component : NewTaskComponent , canActivate: [RoleGuard]},
{ path: 'basic-ui', loadChildren: () => import('../basic-ui/basic-ui.module').then(m => m.BasicUiModule) },
{ path: 'forms', loadChildren: () => import('../forms/form.module').then(m => m.FormModule) },
{ path: 'tables', loadChildren: () => import('../tables/tables.module').then(m => m.TablesModule) },
{ path: 'icons', loadChildren: () => import('../icons/icons.module').then(m => m.IconsModule) },
{ path: 'general-pages', loadChildren: () => import('../general-pages/general-pages.module').then(m => m.GeneralPagesModule) },
{ path: 'apps', loadChildren: () => import('../apps/apps.module').then(m => m.AppsModule) },
{ path: 'user-pages', loadChildren: () => import('../user-pages/user-pages.module').then(m => m.UserPagesModule) },
{ path: 'error-pages', loadChildren: () => import('../error-pages/error-pages.module').then(m => m.ErrorPagesModule) },

]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule { }