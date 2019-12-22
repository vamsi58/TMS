import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from "./guards/auth-guard";
import { SignupComponent } from "./signup/signup.component";
import { SigninComponent } from "./signin/signin.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { HomeComponent } from "./home/home.component";
import { QuestionsComponent } from "./questions/questions/questions.component";


const routes: Routes = [
  { 
    path: "signin", 
    component: SigninComponent 
  },
  { 
    path: "signup", 
    component: SignupComponent 
  },

  { 
    path: "", 
    redirectTo: 'home',
    pathMatch: 'full'
  },

  { 
    path: '', 
    component: NavbarComponent, 
    //canActivate: [AuthGuard],
    children: [
    { 
      path: 'home', 
      component: HomeComponent
    }, 
    { path: "questions", 
     component: QuestionsComponent
    },
       
     ]
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
