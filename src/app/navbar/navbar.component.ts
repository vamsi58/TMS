import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {TooltipPosition} from '@angular/material';
import {AuthService} from '../services/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  sidenavWidth = 3;
  ngStyle: string;
  public positionOptions: TooltipPosition[] = ['left'];   
  public position = new FormControl(this.positionOptions[0]);  
  
  constructor(private authService:AuthService) {
   }

  ngOnInit() {
  }

  increase() {
    this.sidenavWidth = 11;
  }
  decrease() {
    this.sidenavWidth = 3;
  }

  onLogout() {
    this.authService.logout();
  }

}
