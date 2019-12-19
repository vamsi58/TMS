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
  
  
  public positionOptions: TooltipPosition[] = ['left']; // Position Tool Tip 
  public position = new FormControl(this.positionOptions[0]); // tslint:disable-next-line:typedef
  
  
  constructor(private authService:AuthService) {
   }


  ngOnInit() {
  }

  onLogout() {
    this.authService.logout();
  }

}
