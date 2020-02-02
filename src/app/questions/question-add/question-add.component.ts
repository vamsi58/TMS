
import { Subscription, Observable } from 'rxjs';
import { Answer } from './../../models/answer.model';
import { Question } from './../../models/question.model';
import { Component, OnInit,ViewEncapsulation } from '@angular/core';
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
  selector: 'app-question-add',
  templateUrl: './question-add.component.html',
  styleUrls: ['./question-add.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class QuestionAddComponent implements OnInit {

  formGroup: FormGroup;
  public value: string = 'test text test';
  dropdownTags: string[] = [];
  selectedTags: string[] = [];
  dropdownSkills: string[] = [];
  selectedSkills: string[] = [];
  skills: Skill[] = [];
  tags: Tag[] = [];
  Complexity = ['High', 'Medium', 'Low'];
  questionType = "MCQ Single";
  edit_ques_id: string;
  currentMode: string = "Create";
  title: string = "Add Question";
  editQuestion: Question;
  questonObservable: Observable<Question>;
  loadingData: boolean = false;
  defaultCommplexity: string = "medium";
  defaultQuestionType: number = 0;
  submitButton: string = "create";
  editTags: String[] = [];
  editSkills: String[] = [];

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
    private userData: AuthService, private tagService: TagService, private skillService: SkillService,
    private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.loadTags();
    this.loadSkills();
    this.createForm();
    this.edit_ques_id = this.activatedRoute.snapshot.params['id'];

    if (this.edit_ques_id !== undefined) {
      this.currentMode = "edit";
      this.title = "Edit Question";
      this.loadingData = true;
      this.getQuestion();
      this.submitButton = "Save";
    }

  } 

  ngOnChanges() {
    if (this.currentMode  === "edit" ) {
      this.updateForm();
    }
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'type': new FormControl('MCQ Single'),
      'tags': new FormControl('', [Validators.required]),
      'skills': new FormControl('', [Validators.required]),
      'stmtHtml': new FormControl('', Validators.required),
      'options': this.formBuilder.array([]),
      'descAnswer': new FormControl('a', Validators.required),
      'comment': new FormControl(''),
      'complexity': new FormControl('low'),
    });

    this.addNewOption();
    this.addNewOption();
  }

  updateForm() {
    this.formGroup.patchValue({
      type: this.editQuestion.type,
      tags: this.editQuestion.tags,
      skills: this.editQuestion.skills,
      stmtHtml: this.editQuestion.stmtHtml,
      options: this.editQuestion.options,
      descAnswer: this.editQuestion.descAnswer,
      comment: this.editQuestion.comment,
      complexity: this.editQuestion.complexity,
    });
    this.editTags = this.editQuestion.tags;
    this.editSkills = this.editQuestion.skills;
    this.defaultCommplexity = this.editQuestion.complexity;
    if (this.editQuestion.type === "MCQ Multiple") {
      this.defaultQuestionType = 1;
    } else if (this.editQuestion.type === "One Word") {
      this.defaultQuestionType = 2;
    } else if (this.editQuestion.type === "Descriptive") {
      this.defaultQuestionType = 3;
    } else {
      this.defaultQuestionType = 0;
    }
    this.updateOption();
  }

  addNewOption() {
    const formOptions = (this.formGroup.get('options') as FormArray);
    formOptions.push(this.formBuilder.group({
      option: new FormControl({ value: 'option', disabled: true }),
      answer: ['', Validators.required],
      isCorrect: [false]
    }));
  }

  updateOption(): FormArray {
    let formOptions = (this.formGroup.get('options') as FormArray);
    this.deleteAllOptions(formOptions);
    if (this.editQuestion.options !== undefined) {
      for (let editOption of this.editQuestion.options) {
        formOptions.push(this.formBuilder.group({
          option: new FormControl({ value: editOption.option, disabled: true }),
          answer: [editOption.answer, Validators.required],
          isCorrect: [editOption.isCorrect]
        }));
      }
    }
    return formOptions;
  }

  deleteAllOptions(formOptions){
    while (formOptions.length !== 0) {
    formOptions.removeAt(0);
  }
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
  }

  onComplexityChange(event: MatSliderChange) {
    this.formGroup.controls['complexity'].setValue(event.value);
  }

  onTagSelected(data: any) {
    this.formGroup.get('tags').setValue(data);
    this.selectedTags = data;
  }

  onSkillSelected(data: any) {
    this.formGroup.get('skills').setValue(data);
    this.selectedSkills = data;
  }


  loadSkills() {
    this.skillService.getSkills();
    this.skillService
      .getSkillUpdateListener()
      .subscribe((skillData: { skills: Skill[]; }) => {
        this.skills = skillData.skills;
        this.dropdownSkills = this.skills.map(a => a.skillName);
      });
  }

  loadTags() {
    this.tagService.getTags();
    this.tagService
      .getTagUpdateListener()
      .subscribe((tagData: { tags: Tag[]; }) => {
        this.tags = tagData.tags;
        this.dropdownTags = this.tags.map(a => a.tagName);
      });
  }

  addNewItems() {
    this.selectedSkills.forEach(element => {
      if (this.dropdownSkills.indexOf(element) < 0) {
        this.skillService.createSkill(element);
      }
    });

    this.selectedTags.forEach(element => {
      if (this.dropdownTags.indexOf(element) < 0) {
        this.tagService.createTag(element);
      }
    });
  }

  private getQuestion() {
    this.questionService.getQuestion(this.edit_ques_id).subscribe(questionData => {
      this.editQuestion = {
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
      this.updateForm();
      this.loadingData = false;
    });
  }

  onCreate(form: NgForm) {
    if (form.invalid) {
      return;
    }

    let currentUser = this.userData.getCurrentUserName();
    let questionText = (this.formGroup.get('stmtHtml').value).replace(/<[^>]*>/g, '');
    this.addNewItems();
    console.log("this is comment"+ this.currentMode);
    if (this.currentMode === "edit") {
      this.questionService.updateQuestion(this.editQuestion.id, this.formGroup.get('type').value, this.formGroup.get('tags').value, this.formGroup.get('skills').value, questionText, this.formGroup.get('stmtHtml').value, this.formGroup.get('options').value,
        this.formGroup.get('descAnswer').value, this.formGroup.get('comment').value, 'to be approved', this.formGroup.get('complexity').value, currentUser, "", "");
    }
    else {
      this.questionService.createQuestion('dummyid', this.formGroup.get('type').value, this.formGroup.get('tags').value, this.formGroup.get('skills').value, questionText, this.formGroup.get('stmtHtml').value, this.formGroup.get('options').value,
        this.formGroup.get('descAnswer').value, this.formGroup.get('comment').value, 'to be approved', this.formGroup.get('complexity').value, currentUser, "", "");
    }
  }
}


