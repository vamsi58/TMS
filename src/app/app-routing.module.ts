import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from "./guards/auth-guard";
import { SignupComponent } from "./signup/signup.component";
import { SigninComponent } from "./signin/signin.component";


const routes: Routes = [
  { 
    path: "signin", 
    component: SigninComponent 
  },
  { 
    path: "signup", 
    component: SignupComponent 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
