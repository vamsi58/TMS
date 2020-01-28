export interface Tag {
    id : string;
    tagName    : string;
  }

   export class FilterTag {
    id : string;
    value  : string;
    checked : boolean;
    constructor(item: Tag) {
        this.id = item.id;
        this.value = item.tagName;
        this.checked = false;
    }
  }