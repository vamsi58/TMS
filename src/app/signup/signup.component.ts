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
  genders = ["Male", "Female"];
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.fname,  form.value.dob, form.value.gendergroup, form.value.email, form.value.password, null);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
