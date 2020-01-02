import { DropdownValue } from './../models/dropdown.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';



@Component({
  selector: 'custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.css']
})
export class CustomDropdownComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  itemCtrl = new FormControl();
  filteredItems: Observable<string[]>;
  //items: string[] = ['Lemon'];
  //allItems: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  allItems: string[] = [];
  items: string[] = [];
  label: string = ' ';
  formControlDropdown = new FormControl('', Validators.required);

  @Input()
  values: DropdownValue[];

  @Input()
  formGroup: FormGroup;

  @Output()
  select: EventEmitter<string[]>;

 
  @ViewChild('itemInput', {static: false}) itemInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor() {
    
    this.filteredItems = this.itemCtrl.valueChanges.pipe(
        startWith(null),
        map((item: string | null) => item ? this._filter(item) : this.allItems.slice()));
    this.select = new EventEmitter();
  }


  ngOnInit() {
     this.allItems = this.values['value'];
     this.label    = this.values['labels'][0];
  }


  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our item
      if ((value || '').trim()) {
        this.items.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.itemCtrl.setValue(null);
    }
  }

  remove(item: string): void {
    const index = this.items.indexOf(item);

    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.items.push(event.option.viewValue);
    this.itemInput.nativeElement.value = '';
    this.itemCtrl.setValue(null);
    this.select.emit(this.items);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allItems.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
  }

}
