import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgForm } from "@angular/forms";
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl } from '@angular/forms';
import { QuestionService } from './../../services/question.service';
import { MatTabChangeEvent,MatSliderChange } from '@angular/material';

@Component({
  selector: 'app-question-add',
  templateUrl: './question-add.component.html',
  styleUrls: ['./question-add.component.css']
})
export class QuestionAddComponent implements OnInit {


  formGroup: FormGroup;
  public value: string = 'test text test'; 
  Type = ['Objective', 'Descriptive'];
  Category = ['Technical', 'Functional'];
  Competency = ['IBM i', 'Java', 'Angular'];
  Complexity = ['High', 'Medium', 'Low'];
  objectiveQuestion = true;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '6rem',
    minHeight: '5rem',
    minWidth: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no', 
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
    ]
  };
  
  constructor(private formBuilder: FormBuilder, public questionService: QuestionService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(){
    this.formGroup = this.formBuilder.group({
       'type'      : ['Objective',Validators.required],            
       'category'  : ['',Validators.required],       
       'competency': ['',Validators.required],               
       'textHtml'  : ['',Validators.required],       
       'options'   : this.formBuilder.array([]),         
       'comment'   : [''],                
       'complexity': ['medium',Validators.required]          
    });

    this.addNewOption();
  }

  addNewOption(){
    const formOptions = (this.formGroup.get('options') as FormArray);
    formOptions.push(this.formBuilder.group({
      option   : new FormControl({value: 'option', disabled: true}, Validators.required),
      answer   : ['',    Validators.required],
      isCorrect: [false]
    }));
  }

  deleteOption(i:number){
    const formOptions = (this.formGroup.get('options') as FormArray);
    formOptions.removeAt(i);
    if(formOptions.length===0){
      this.addNewOption();
    }
  }
  
  setOptionValue(fa:FormArray, i:number){
    fa.controls['option'].setValue('option '+(i+1));
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

  get optionsForm() {
    return  (<FormArray>this.formGroup.get('options')).controls;
  }

  onQuestionTypeChange(event: MatTabChangeEvent) {
    this.formGroup.controls['type'].setValue(event.tab.textLabel);
  }

  onComplexityChange(event: MatSliderChange) {
    this.formGroup.controls['complexity'].setValue(event.value);
  }


}
