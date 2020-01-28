export interface Skill {
    id : string;
    skillName  : string;
  }

  export class FilterSkill {
    id : string;
    value  : string;
    checked : boolean;
    constructor(item: Skill) {
        this.id = item.id;
        this.value = item.skillName;
        this.checked = false;
    }
  }