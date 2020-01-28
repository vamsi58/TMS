import { ConfirmDialogComponent } from './../../confirm-dialog/confirm-dialog.component';
import { Question } from './../../models/question.model';
import { QuestionService } from './../../services/question.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Subscription } from "rxjs";
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { state, style, trigger } from '@angular/animations';
import { Tag,FilterTag } from './../../models/tag.model';
import { Skill,FilterSkill } from './../../models/skill.model';
import { SkillService } from './../../services/skill.service';
import { TagService } from './../../services/tag.service';
import { MatCheckboxModule } from '@angular/material';




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
  questionsPerPage = 1000;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private questionsSub: Subscription;
  private _filterQuestion: string;
  private filteredType: string;
  private filteredCats: string[];
  private filteredSubcats: string[];
  questions: Question[] = [];
  //displayedColumns = ['select', 'id', 'stmt', 'actions'];
  displayedColumns = ['id', 'stmt', 'actions'];
  dataSource = new MatTableDataSource<Question>(this.questions);
  selection = new SelectionModel<Question>(true, []);
  loadingData: boolean = true;
  //filterTypes = ['MCQ Single', 'MCQ Multiple', 'One Word', 'Descriptive'];
  filterSelectedStatus:string = "All";
  quesType: boolean;
  complexity: boolean;
  filterValues: any = {};
  
  filterTypes = [
    { 
      id:1,
      value:'MCQ Single',
      checked:false
     },
     { 
      id:1,
      value:'MCQ Multiple',
      checked:false
     },
     { 
      id:1,
      value:'One Word',
      checked:false
     },
     { 
      id:1,
      value:'Descriptive',
      checked:false
     } ];

  filterComplexities = [
    { 
      id:1,
      value:'High',
      checked:false
     },
     { 
      id:1,
      value:'Medium',
      checked:false
     },
     { 
      id:1,
      value:'Low',
      checked:false
     } ];

  filterStatus = [
    { 
      id:1,
      value:'All',
     },
     { 
      id:1,
      value:'Approved',
     },
     { 
      id:1,
      value:'To be approved',
     } ];

  filterTags: FilterTag[];
  filterSkills: FilterSkill[];
  skills: Skill[] = [];
  tags: Tag[] = [];
  matCheckStatus: boolean = false;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  

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
        this.dataSource = new MatTableDataSource<Question>(this.questions);

        this.dataSource.filterPredicate = ((data: Question, filter: string): boolean => {
      const filterValues = JSON.parse(filter);

      return (this.quesType ? data.type.trim().toLowerCase() === filterValues.type : true) &&
      (this.complexity ? data.complexity.trim().toLowerCase().indexOf(filterValues.complexity) !== -1 : true);
    })

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loadingData = false;
      });
    this.loadTags();
    this.loadSkills();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
        console.log(this.filterSkills);
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
    console.log(this.filterSkills[0]);
    for (let type of this.filterTypes){
      this.applyFilter('type', this.quesType ? item.value: '')
    }
  }

  onFilterStatusChange(value) {
      this.filterSelectedStatus = value;
  }

  applyFilter(column: string, filterValue: string) {
    this.filterValues[column] = filterValue;
    this.dataSource.filter = JSON.stringify(this.filterValues);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


} 