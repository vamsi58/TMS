import { Question } from './../../models/question.model';
import { QuestionService } from './../../services/question.service';
import { Component, OnInit, OnChanges } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { MatDialog } from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';


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
  displayedColumns = ['select','quesId', 'quesType', 'quesCat','quesSubCat', 'question','actions' ];
  dataSource = new MatTableDataSource<Question>(this.questions);
  selection = new SelectionModel<Question>(true, []);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


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
        this.dataSource = new MatTableDataSource<Question>(this.questions);
        this.dataSource.paginator = this.paginator;
      });     
  }

  /* ====================== ROW SELECTION ===================================== */
  /** check if selected rows matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all or clear all*/
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Question): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.quesId + 1}`;
  }
}
