import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from "../services/auth.service";

@Component({
  templateUrl:"./signin.component.html",
  styleUrls: ["./signin.component.css"]
})
export class SigninComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  formGroup: FormGroup;

  constructor(public authService: AuthService, private formBuilder: FormBuilder) { }

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
      'email': ['', Validators.required],
      'password': ['', Validators.required],
    });
  }

  getError(el) {
    switch (el) {
      case 'username':
        if (this.formGroup.get('email').hasError('required')) {
          return 'Username required';
        }
        break;
      case 'password':
        if (this.formGroup.get('password').hasError('required')) {
          return 'Password required';
        }
        break;
      default:
        return '';
    }
  }

  onSignin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    console.log(this.formGroup.get('email').value);
    this.authService.signin(this.formGroup.get('email').value, this.formGroup.get('password').value);

  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
