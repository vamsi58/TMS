import { Question } from './../models/question.model';
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject, pipe } from "rxjs";

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

  //Add Question
  createQuestion(dummyId: string, quesid: string, questype: string, quesCat: string, quesSubCat: string, question: string, quesFormatted: string, quesAnswers: Answer[], quesReason: string, quesAproved: boolean, quesComplex:string) {
    const Question: Question = { id: dummyId, quesid: quesid, questype: questype, quesCat: quesCat, quesSubCat: quesSubCat, question: question, quesFormatted: quesFormatted, quesAnswers: quesAnswers, quesReason: quesReason, quesAproved: quesAproved, quesComplex:quesComplex };


    this.http
      .post("http://localhost:3000/api/question/add", Question)
      .subscribe(() => {
        this.router.navigate(["/questions"]);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  //Get all Questinos
  viewQuestion(questionsperpage: number, 
               currentPage: number, 
               filteredType: string,
               filteredCats: string[],
              filteredSubCats: string[] ) {

  //console.log(filteredSubCats);
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
                quesid: question.quesid,
                questype: question.questype,
                quesCat: question.quesCat,
                quesSubCat: question.quesSubCat,
                question: question.question,
                quesFormatted: question.quesFormatted,
                quesAnswers: question.answerOptions,
                quesReason: question.reason,
                quesAproved: question.quesAproved,
                quesComplex: question.quesComplex
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

  //Update Question
  updateQuestion(id: string, quesid: string, questype: string, quesCat: string, quesSubCat: string, question: string, quesFormatted: string, quesAnswers: Answer[], quesReason: string, quesAproved: boolean, quesComplex: string) {
    const questionUpdateData: Question = { id: id, quesid: quesid, questype: questype, quesCat: quesCat, quesSubCat: quesSubCat, question: question, quesFormatted: quesFormatted, quesAnswers: quesAnswers, quesReason: quesReason, quesAproved: quesAproved , quesComplex: quesComplex };

    console.log(questionUpdateData);
     this.http
       .put("http://localhost:3000/api/question/update/" + id, questionUpdateData)
       .subscribe(response => {
        this.router.navigate(["/questions"]);
        console.log(response);
      });
  }

  //Delete Question
  deleteQuestion(quesid: string) {
    return this.http.delete("http://localhost:3000/api/question/delete/" + quesid);
  }


  // getQuestion(quesid: string) {
  //   return this.http.get<{
  //     quesid: string;
  //     questype: string;
  //     quesCat: string; 
  //     quesSubCat: string;
  //     question: string;
  //     quesFormatted: string;
  //     quesAnswers: Answer[];
  //     quesReason:string;

  //   }>("http://localhost:3000/api/question/update" + quesid);
  // }

}
