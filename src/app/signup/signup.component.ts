import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from "../services/auth.service";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  rolesList = ['User', 'Admin', 'Manager', 'Lead'];
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, public authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.createForm();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'name': ['', Validators.required],
      'email': ['', Validators.required],
      'password': ['', Validators.required],
      'dob': ['', Validators.required],
      'roles': [null]
    });
  }

  getError(el) {
    switch (el) {
      case 'name':
        if (this.formGroup.get('name').hasError('required')) {
          return 'name required';
        }
        break;
      case 'email':
        if (this.formGroup.get('email').hasError('required')) {
          return 'email required';
        }
        break;
      case 'password':
        if (this.formGroup.get('password').hasError('required')) {
          return 'Password required';
        }
        break;
      case 'dob':
        if (this.formGroup.get('dob').hasError('required')) {
          return 'Date Of Birth required';
        }
        break;
    
      case 'roles':
        if (this.formGroup.get('roles').hasError('roles')) {
          return 'Role required';
        }
        break;
      default:
        return '';
    }
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form);
    this.isLoading = true;
    this.authService.createUser(this.formGroup.get('name').value, this.formGroup.get('email').value, this.formGroup.get('password').value,this.formGroup.get('dob').value, this.formGroup.get('roles').value);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}

