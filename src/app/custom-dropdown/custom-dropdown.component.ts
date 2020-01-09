import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';





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
  allItems: string[] = [];
  // items: string[] = [];
  formControlDropdown = new FormControl('', Validators.required);

  @Input()
  values: string[];
  @Input()
  label: string ;
  @Input()
  items: string[];
 

  @Output()
  select: EventEmitter<string[]>;


  @ViewChild('itemInput', { static: false }) itemInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor() {
    this.allItems = this.values;
    this.reloadItems();
    this.select = new EventEmitter();
    // this.items = this.editOptons;
  }


  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.allItems = this.values;
    this.reloadItems();
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
    this.select.emit(this.items);
  }

  remove(item: string): void {
    const index = this.items.indexOf(item);

    if (index >= 0) {
      this.items.splice(index, 1);
    }
    this.select.emit(this.items);
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

  reloadItems(){
    if (this.allItems !== undefined && this.allItems.length > 0) {
      this.filteredItems = this.itemCtrl.valueChanges.pipe(
        startWith(null),
        map((item: string | null) => item ? this._filter(item) : this.allItems.slice()));
    }
  }

}
