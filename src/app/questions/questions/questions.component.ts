import { ConfirmDialogComponent } from './../../confirm-dialog/confirm-dialog.component';
import { Question } from './../../models/question.model';
import { QuestionService } from './../../services/question.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from "rxjs";
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { Tag, FilterTag } from './../../models/tag.model';
import { Skill, FilterSkill } from './../../models/skill.model';
import { SkillService } from './../../services/skill.service';
import { TagService } from './../../services/tag.service';



@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class QuestionsComponent implements OnInit {
  oDoc;
  aDoc;
  sDefTxt;
  objectiveQuestion = true;
  isLoading = false;
  totalQuestions = 0;
  questionsPerPage = 1000;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private questionsSub: Subscription;
  private filteredType: string;
  private filteredCats: string[];
  private filteredSubcats: string[];
  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  displayedColumns = ['id', 'stmt','select'];
  dataSource = new MatTableDataSource<Question>(this.questions);
  selection = new SelectionModel<Question>(true, []);
  loadingData: boolean = true;
  filterSelectedStatus: string = "All";
  filterItemCount:number = 0;
  quesType: boolean;
  complexity: boolean;
  filterValues: any = {};
  searchField;

  filterTypes = [
    {
      id: 1,
      value: 'MCQ Single',
      checked: false
    },
    {
      id: 1,
      value: 'MCQ Multiple',
      checked: false
    },
    {
      id: 1,
      value: 'One Word',
      checked: false
    },
    {
      id: 1,
      value: 'Descriptive',
      checked: false
    }];

  filterComplexities = [
    {
      id: 1,
      value: 'High',
      checked: false
    },
    {
      id: 1,
      value: 'Medium',
      checked: false
    },
    {
      id: 1,
      value: 'Low',
      checked: false
    }];

  filterStatus = [
    {
      id: 1,
      value: 'All',
    },
    {
      id: 1,
      value: 'Approved',
    },
    {
      id: 1,
      value: 'To be approved',
    }];

  filterTags: FilterTag[];
  filterSkills: FilterSkill[];
  skills: Skill[] = [];
  tags: Tag[] = [];
  matCheckStatus: boolean = false;

  private paginator: MatPaginator;
  private sort: MatSort;


  @ViewChild(MatSort,{ static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator,{ static: true }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(private questionService: QuestionService,
    private dialog: MatDialog, private tagService: TagService, private skillService: SkillService) {
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
        this.filteredQuestions = this.questions;
        this.dataSource = new MatTableDataSource<Question>(this.filteredQuestions);
        this.loadingData = false;
        this.setDataSourceAttributes();
      });
    this.loadTags();
    this.loadSkills();
  }

  ngAfterViewInit() {
    // this.setDataSourceAttributes();
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: Question): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  onMouseOver(row) {
    const id = row.id;
    this.questions.map((data: any) => {
      if (data.id === id) {
        data.show = true;
      }
    });
  }

  onMouseLeave(row) {
    const id = row.id;
    this.questions.map((data: any) => {
      if (data.id === id) {
        data.show = false;
      }
    });
  }

  onDelete(quesId: string, quesName: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure, you want to delete this question?',
        question: quesName,
        buttonText: {
          ok: 'Delete',
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.questionService.deleteQuestion(quesId)
      }
    });
  }

  loadSkills() {
    this.skillService.getSkills();
    this.skillService
      .getSkillUpdateListener()
      .subscribe((skillData: { skills: Skill[]; }) => {
        this.skills = skillData.skills;
        this.filterSkills = this.skills.map(a => new FilterSkill(a));
      });
  }

  loadTags() {
    this.tagService.getTags();
    this.tagService
      .getTagUpdateListener()
      .subscribe((tagData: { tags: Tag[]; }) => {
        this.tags = tagData.tags;
        this.filterTags = this.tags.map(a => new FilterTag(a));
      });
  }

  onSearch = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onFilterChange(item, checked) {
    item.checked = checked;
    if (checked){
       this.filterItemCount+=1;
    }
    else{
      this.filterItemCount-=1;
    }
    this.applyFilter();
  }

  onFilterStatusChange(value) {
    this.filterSelectedStatus = value;
    if (value!=="All"){
      this.filterItemCount+=1;
   }
   else{
     this.filterItemCount-=1;
   }
    this.applyFilter();
  }

  applyFilter(){
    this.filteredQuestions = this.questions;
    this.filteredQuestions = this.filteredQuestions.filter(question => {
      let noSelection = true;
      let selected = false;
      for (let type of this.filterTypes) {
        if (type.checked) {
          if (question.type == type.value) {
            selected = true;
          }
          noSelection = false;
        }
      }
      if (!noSelection && !selected){
        return false;
      } else {
        noSelection = true;
        selected = false;
      }
      for (let complexity of this.filterComplexities) {
        if (complexity.checked) {
          if (question.complexity == complexity.value.toLowerCase()) {
            selected = true;
          }
          noSelection = false;
        }
      }
      if (!noSelection && !selected){
        return false;
      } else {
        noSelection = true;
        selected = false;
      }
      if (this.filterSelectedStatus!=='All' && question.status !== this.filterSelectedStatus.toLowerCase()){
         return false;
      }
      for (let tag of this.filterTags) {
        if (tag.checked) {
          if ((question.tags.filter(t => t == tag.value)).length > 0) {
            selected = true;
          }
          noSelection = false;
        }
      }
      if (!noSelection && !selected){
        return false;
      } else {
        noSelection = true;
        selected = false;
      }
      for (let skill of this.filterSkills) {
        if (skill.checked) {
          if ((question.skills.filter(s => s == skill.value)).length > 0) {
            selected = true;
          }
          noSelection = false;
        }
      }
      if (!noSelection && !selected){
        return false;
      } else {
        return true;
      }
    });

    this.dataSource = new MatTableDataSource<Question>(this.filteredQuestions);
    this.setDataSourceAttributes();
  }

  clearAllFilters(){
    for (let item of this.filterTypes){
      item.checked = false;
    }
    for (let item of this.filterComplexities){
      item.checked = false;
    }
    for (let item of this.filterTags){
      item.checked = false;
    }
    for (let item of this.filterSkills){
      item.checked = false;
    }
    this.filterItemCount = 0;
    this.filterSelectedStatus = "All";
    this.dataSource = new MatTableDataSource<Question>(this.questions);
    this.setDataSourceAttributes();
  }

  clearSearchField() {
    this.searchField = '';
    this.dataSource.filter = '';
  }

} 