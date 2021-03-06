import { Answer } from './../models/answer.model';
import { Question } from './../models/question.model';
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject, Observable, pipe, from } from "rxjs";


import {
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap
} from "rxjs/operators";
 

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private authStatusListener = new Subject<boolean>();
  private questions: Question[] = [];
  private questionsUpdated = new Subject<{ questions: Question[]; questionCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  // Add Question
  createQuestion(dummyId: string, type: string, tags: string[], skills: string[], stmt: string, stmtHtml: string, options: Answer[], descAnswer: string, comment: string, status: string, complexity:string, createdBy:string, updatedBy:string, approvedBy:string) {
    const Question: Question = { id: dummyId, type: type, tags: tags, skills: skills, stmt: stmt, stmtHtml: stmtHtml, options: options, descAnswer: descAnswer, comment: comment, status: status, complexity:complexity, createdBy:createdBy, updatedBy:updatedBy, approvedBy:approvedBy };


    this.http
      .post("http://localhost:3000/api/question/add", Question)
      .subscribe(() => {
        this.router.navigate(["/questions"]);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  // Get all Questinos
  viewQuestion(questionsperpage: number, 
               currentPage: number, 
               filteredType: string,
               filteredCats: string[],
              filteredSubCats: string[] ) {
    const queryParams = `?pagesize=${questionsperpage}&page=${currentPage}&Type=${filteredType}&Cat=${filteredCats}&SubCat=${filteredSubCats}`;
    return this.http
      .get<{ message: string; questions: any; maxQuestions: number }>(
        "http://localhost:3000/api/question/view" + queryParams
      )
      .pipe(
        map(questionData => {
          return {
            questions: questionData.questions.map(question => {
              return {
                id: question._id,
                type: question.type,
                tags: question.tags,
                skills: question.skills,
                stmt: question.stmt,
                stmtHtml: question.stmtHtml,
                options: question.options,
                descAnswer: question.descAnswer,
                comment: question.comment,
                status: question.status,
                complexity: question.complexity,
                createdBy: question.createdBy,
                updatedBy: question.updatedBy,
                approvedBy: question.approvedBy,
              };
            }),
            maxQuestions: questionData.maxQuestions
          };
        })
      )
      .subscribe(transformedQuestionData => {
        this.questions = transformedQuestionData.questions;
        this.questionsUpdated.next({
          questions: [...this.questions],
          questionCount: transformedQuestionData.maxQuestions
        });
      });

  }

  getQuestionUpdateListener() {
    return this.questionsUpdated.asObservable();
  }

  // Update Question
  updateQuestion(id: string, type: string, tags: string[], skills: string[], stmt: string, stmtHtml: string, options: Answer[], descAnswer: string, comment:string, status: string, complexity:string, createdBy:string, updatedBy:string, approvedBy:string) {
    const questionUpdateData: Question = { id: id, type: type, tags: tags, skills: skills, stmt: stmt, stmtHtml: stmtHtml, options: options, descAnswer: descAnswer, comment: comment, status: status, complexity:complexity, createdBy:createdBy, updatedBy:updatedBy, approvedBy:approvedBy };

     this.http
       .put("http://localhost:3000/api/question/update/" + id, questionUpdateData)
       .subscribe(response => {
        this.router.navigate(["/questions"]);
      });
  }

  // Delete Question
  deleteQuestion(id: string) {
    this.http.delete("http://localhost:3000/api/question/delete/" + id).subscribe(result => {
      const updatedQuestions = this.questions.filter(question => question.id !== id);
      this.questions = updatedQuestions;
      this.questionsUpdated.next({
        questions: [...this.questions],
        questionCount: 1
      });
    });
  }

  // get a question by Id
  getQuestion(id: string):Observable<any> {
    return this.http.get<{
                _id: string,
                type: string,
                tags: string[],
                skills: string[],
                stmt: string,
                stmtHtml: string,
                options: Answer[],
                descAnswer: string,
                comment: string,
                status: string,
                complexity: string,
                createdBy: string,
                updatedBy: string,
                approvedBy: string     
    }>("http://localhost:3000/api/question/get/" + id);
  }
}
