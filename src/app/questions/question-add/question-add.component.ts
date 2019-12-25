import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgForm } from "@angular/forms";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionService } from './../../services/question.service';

@Component({
  selector: 'app-question-add',
  templateUrl: './question-add.component.html',
  styleUrls: ['./question-add.component.css']
})
export class QuestionAddComponent implements OnInit {

  name = 'Angular 6';
  htmlContent = '';
  htmlContent2 = '';
  formGroup: FormGroup;
  public value: string = 'test text test'; 
  Type = ['Objective', 'Descriptive'];
  Category = ['Technical', 'Functional'];
  Competency = ['IBM i', 'Java', 'Angular'];
  Complexity = ['High', 'Medium', 'Low'];
  
  constructor(private formBuilder: FormBuilder, public questionService: QuestionService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(){
    this.formGroup = this.formBuilder.group({
       'type'      : ['',[Validators.required]],            
       'category'  : ['',[Validators.required]],       
       'competency': ['',[Validators.required]],               
       'textHtml'  : ['',Validators.required],       
       'options'   : ['',[Validators.required]],         
       'comment'   : ['',Validators.required],                
       'complexity': ['',Validators.required]          
    });
  }

  getError(el) {
    switch (el) {
      case 'type':
        if (this.formGroup.get('type').hasError('required')) {
          return 'Question Type Required';
        }
        break;
      case 'category':
        if (this.formGroup.get('category').hasError('required')) {
          return 'Question Category Required';
        }
        break;
      case 'competency':
        if (this.formGroup.get('competency').hasError('required')) {
          return 'Competency Required';
        }
        break;
      case 'textHtml':
        if (this.formGroup.get('textHtml').hasError('required')) {
          return 'Question Required';
        }
        break;
    
      case 'options':
        if (this.formGroup.get('options').hasError('required')) {
          return 'Answer Required';
        }
        break;
      case 'comment':
          if (this.formGroup.get('comment').hasError('required')) {
            return 'Comment Required';
          }
          break;
      case 'status':
            if (this.formGroup.get('status').hasError('required')) {
              return 'Status Required';
            }
            break;
      case 'complexity':
              if (this.formGroup.get('complexity').hasError('required')) {
                return 'Complexity Required';
              }
              break;
      default:
        return '';
    }
  }


}
