import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-question-add',
  templateUrl: './question-add.component.html',
  styleUrls: ['./question-add.component.css']
})
export class QuestionAddComponent implements OnInit {

  public value: string = 'test text test'; 
  

  constructor() { }

  ngOnInit() {
  }

}
