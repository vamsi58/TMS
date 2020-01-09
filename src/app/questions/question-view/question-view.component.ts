
import { Subscription, Observable } from 'rxjs';
import { Answer } from './../../models/answer.model';
import { Question } from './../../models/question.model';
import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { QuestionService } from './../../services/question.service';
import { SkillService } from './../../services/skill.service';
import { TagService } from './../../services/tag.service';
import { MatTabChangeEvent, MatSliderChange } from '@angular/material';
import { NgForm } from "@angular/forms";
import { AuthService } from "./../../services/auth.service";
import { Tag } from './../../models/tag.model';
import { Skill } from './../../models/skill.model';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-question-view',
  templateUrl: './question-view.component.html',
  styleUrls: ['./question-view.component.css']
})
export class QuestionViewComponent implements OnInit {

  question: Question;
  quesId:string;
  loadingData:boolean = true;
  
  constructor(public questionService: QuestionService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.quesId = this.activatedRoute.snapshot.params['id'];
    this.getQuestion();
  } 

  ngOnChanges() {
    
  }
  
  private getQuestion() {
    this.questionService.getQuestion(this.quesId).subscribe(questionData => {
      this.question = {
        id: questionData._id,
        type: questionData.type,
        tags: questionData.tags,
        skills: questionData.skills,
        stmt: questionData.stmt,
        stmtHtml: questionData.stmtHtml,
        options: questionData.options,
        descAnswer: questionData.descAnswer,
        comment: questionData.comment,
        status: questionData.status,
        complexity: questionData.complexity,
        createdBy: questionData.createdBy,
        updatedBy: questionData.updatedBy,
        approvedBy: questionData.approvedBy
      }
      this.loadingData = false;
    });
  }

}


