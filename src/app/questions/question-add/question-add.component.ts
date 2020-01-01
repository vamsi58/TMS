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


@Component({
  selector: 'app-question-add',
  templateUrl: './question-add.component.html',
  styleUrls: ['./question-add.component.css']
})
export class QuestionAddComponent implements OnInit {

  formGroup: FormGroup;
  public value: string = 'test text test';
  // tags = ['Technical', 'Functional'];
  // skills = ['IBM i', 'Java', 'Angular'];
  skills: Skill[] = [];
  tags: Tag[] = [];
  Complexity = ['High', 'Medium', 'Low'];
  questionType = "MCQ Single";

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '4rem',
    minWidth: '15rem',
    placeholder: 'Enter your question here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    outline: false,
    toolbarHiddenButtons: [
    ]
  };

  constructor(private formBuilder: FormBuilder, public questionService: QuestionService,
    private userData: AuthService, private tagService: TagService, private skillService: SkillService) { }

  ngOnInit() {
    this.loadSkills();
    this.loadTags();
    this.createForm();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'type': ['Objective'],
      'tags': ['', [Validators.required]],
      'skills': ['', [Validators.required]],
      'stmtHtml': ['', Validators.required],
      'options': this.formBuilder.array([]),
      'descAnswer': ['a', Validators.required],
      'comment': [''],
      'complexity': ['medium']
    });

    this.addNewOption();
    this.addNewOption();
  }

  addNewOption() {
    const formOptions = (this.formGroup.get('options') as FormArray);
    formOptions.push(this.formBuilder.group({
      option: new FormControl({ value: 'option', disabled: true }),
      answer: ['', Validators.required],
      isCorrect: [false]
    }));
  }

  deleteOption(i: number) {
    const formOptions = (this.formGroup.get('options') as FormArray);
    formOptions.removeAt(i);
    if (formOptions.length === 0) {
      this.addNewOption();
      this.addNewOption();
    } else if (formOptions.length === 1) {
      this.addNewOption();
    }
  }

  setOptionValue(fa: FormArray, i: number) {
    fa.controls['option'].setValue('option ' + (i + 1));
  }


  getError(el) {
    switch (el) {
      case 'tags':
        if (this.formGroup.get('tags').hasError('required')) {
          return 'Tags Required';
        }
        break;
      case 'skills':
        if (this.formGroup.get('skills').hasError('required')) {
          return 'Skills Required';
        }
        break;
      case 'stmtHtml':
        if (this.formGroup.get('stmtHtml').hasError('required')) {
          return 'Question Required';
        }
        break;

      case 'answer':
        return 'Answer Required';

        break;
      case 'descAnswer':
        if (this.formGroup.get('descAnswer').hasError('required')) {
          return 'Desciptive Answer Required';
        }
        break;
      case 'onewordAnswer':
          if (this.formGroup.get('descAnswer').hasError('required')) {
            return 'One Word Answer Required';
          }
          break;
      case 'comment':
        if (this.formGroup.get('comment').hasError('required')) {
          return 'Explanation Required';
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
    return (<FormArray>this.formGroup.get('options')).controls;
  }

  clearOptions() {
    const formOptions = (this.formGroup.get('options') as FormArray);
    while (formOptions.length !== 0) {
      formOptions.removeAt(0)
    }
  }

  onQuestionTypeChange(event: MatTabChangeEvent) {
    this.formGroup.controls['type'].setValue(event.tab.textLabel);
    this.questionType = event.tab.textLabel;
    this.clearOptions();
    var re = /MCQ/gi;
    if (this.questionType.search(re) !== -1) {
      this.addNewOption();
      this.addNewOption();
    } else {
      this.formGroup.get('descAnswer').reset();
      this.formGroup.get('descAnswer').setValue('');
    }
    console.log(this.formGroup);
  }

  onComplexityChange(event: MatSliderChange) {
    this.formGroup.controls['complexity'].setValue(event.value);
  }


  onCreate(form: NgForm) {
    if (form.invalid) {
      return;
    }
    let currentUser = this.userData.getCurrentUserName();
    let questionText = (this.formGroup.get('stmtHtml').value).replace(/<[^>]*>/g, '');
    this.questionService.createQuestion('dummyid', this.formGroup.get('type').value, this.formGroup.get('tags').value, this.formGroup.get('skills').value, questionText, this.formGroup.get('stmtHtml').value, this.formGroup.get('options').value,
      this.formGroup.get('descAnswer').value, this.formGroup.get('comment').value, 'created', this.formGroup.get('complexity').value, currentUser, "", "");
  }


  loadSkills(){
    this.skillService
      .getSkillUpdateListener()
      .subscribe((skillData: { skills: Skill[]; }) => {
        this.skills = skillData.skills;
      }); 
  }
  loadTags(){
    this.tagService
      .getTagUpdateListener()
      .subscribe((tagData: { tags: Tag[]; }) => {
        this.tags = tagData.tags;
      }); 
  }

}


