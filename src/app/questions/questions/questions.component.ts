import { Question } from './../../models/question.model';
import { QuestionService } from './../../services/question.service';
import { Component, OnInit, OnChanges } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  oDoc;
  aDoc;
  sDefTxt;
  objectiveQuestion = true;
  isLoading = false;
  totalQuestions = 0;
  questionsPerPage = 4;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private questionsSub: Subscription;
  private _filterQuestion: string;
  private filteredType: string;
  private filteredCats: string[];
  private filteredSubcats: string[];
  questions: Question[] = [];


  @ViewChild('questionForm',{static: false}) createForm: NgForm;
  get filterQuestion(): string {
    return this._filterQuestion;
  }

  constructor(private questionService: QuestionService,
    private dialog: MatDialog) {
  }

  public multiselectfield: Object = { text: 'name', value: 'id' };
  ngOnInit() {
    this.filteredType = 'All';
    this.filteredSubcats = [];
    this.filteredCats = [];
    this.questionService.viewQuestion(
      this.questionsPerPage,
      this.currentPage,
      this.filteredType,
      this.filteredCats,
      this.filteredSubcats);
    this.questionsSub = this.questionService
      .getQuestionUpdateListener()
      .subscribe((questionData: { questions: Question[]; questionCount: number }) => {
        this.totalQuestions = questionData.questionCount;
        this.questions = questionData.questions;
      });
  }
}
