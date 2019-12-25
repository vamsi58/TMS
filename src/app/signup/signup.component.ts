import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from "../services/auth.service";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  rolesList = ['User', 'Admin', 'Manager', 'Lead'];
  groupsList = ['SG-IBM i', 'SG-BCE', 'SG-Java'];
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
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'email': ['', Validators.required],
      'password': ['', Validators.required],
      'phone': ['', Validators.required],
      'dob': ['', Validators.required],
      'roles': ['',[Validators.required]],
      'groups': ['',[Validators.required]]
    });
  }

  // Getter method to access formcontrols
  get selectRole() {
    return this.formGroup.get('cityName');
  }

  get selectGroup() {
    return this.formGroup.get('cityName');
  }

  getError(el) {
    switch (el) {
      case 'firstName':
        if (this.formGroup.get('firstName').hasError('required')) {
          return 'First Name Required';
        }
        break;
      case 'lastName':
          if (this.formGroup.get('lastName').hasError('required')) {
            return 'Last Name Required';
          }
          break;
      case 'email':
        if (this.formGroup.get('email').hasError('required')) {
          return 'Email Required';
        }
        break;
      case 'password':
        if (this.formGroup.get('password').hasError('required')) {
          return 'Password Required';
        }
        break;
      case 'phone':
          if (this.formGroup.get('phone').hasError('required')) {
            return 'Phone Number Required';
          }
          break;
      case 'phone':
            if (this.formGroup.get('phone').hasError('minLength')) {
              return 'Phone Number Required';
            }
            break;
      case 'dob':
        if (this.formGroup.get('dob').hasError('required')) {
          return 'Date Of Birth required';
        }
        break;
    
      case 'roles':
        if (this.formGroup.get('roles').hasError('required')) {
          return 'User Role Required';
        }
        break;
      case 'groups':
          if (this.formGroup.get('groups').hasError('required')) {
            return 'User Group Required';
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
    console.log(this.formGroup.get('roles').value);
    console.log(this.formGroup.get('groups').value);
    this.isLoading = true;
    this.authService.createUser(this.formGroup.get('firstName').value, 
                                this.formGroup.get('lastName').value,
                                this.formGroup.get('email').value, 
                                this.formGroup.get('phone').value, 
                                this.formGroup.get('password').value,
                                this.formGroup.get('dob').value, 
                                this.formGroup.get('roles').value, 
                                this.formGroup.get('groups').value);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}

