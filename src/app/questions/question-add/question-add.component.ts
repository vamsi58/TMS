import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, 
  ValidationErrors, ValidatorFn } from '@angular/forms';
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
    minHeight: '4rem',
    minWidth: '15rem',
    width: '70rem',
    placeholder: 'Enter your question here...',
    translate: 'no', 
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    outline: false,
    toolbarHiddenButtons: [
    ]
  };
  
  constructor(private formBuilder: FormBuilder, public questionService: QuestionService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(){
    this.formGroup = this.formBuilder.group({
       'type'      : ['Objective'],            
       'category'  : ['',Validators.required],       
       'competency': ['',Validators.required],               
       'textHtml'  : ['',Validators.required],       
       'options'   : this.formBuilder.array([]),         
       'comment'   : [''],                
       'complexity': ['medium']          
    });

    this.addNewOption();
    this.addNewOption();
  }

  addNewOption(){
    const formOptions = (this.formGroup.get('options') as FormArray);
    formOptions.push(this.formBuilder.group({
      option   : new FormControl({value: 'option', disabled: true}),
      answer   : ['',    Validators.required],
      isCorrect: [false]
    }));
  }

  deleteOption(i:number){
    const formOptions = (this.formGroup.get('options') as FormArray);
    formOptions.removeAt(i);
    if(formOptions.length===0){
      this.addNewOption();
      this.addNewOption();
    }else if (formOptions.length===1){
      this.addNewOption();
    }
  }
  
  setOptionValue(fa:FormArray, i:number){
    fa.controls['option'].setValue('option '+(i+1));
  }


  getError(el) {
    switch (el) {
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
          console.log("Question Required");
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

class AngularEditorValidator {
  static required(): ValidatorFn {
    return (currentControl: AbstractControl): ValidationErrors|null => {
      if (currentControl.value === '<br>') {
        return {required: true};
      }
      return null;
    };
  }
}

