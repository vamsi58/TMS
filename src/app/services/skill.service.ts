import { Skill } from './../models/skill.model';
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";


import {
  map,
} from "rxjs/operators";
 

@Injectable({
  providedIn: 'root'
})
export class SkillService {


  private skills: Skill[] = [];
  private skillsUpdated = new Subject<{ skills: Skill[]; }>();
  constructor(private http: HttpClient) { }

  //Add Skill
  createSkill(skillName: string) {
    const Skill: Skill = { id:"dummyId", skillName: skillName};

    this.http
      .post("http://localhost:3000/api/skill/add", Skill)
      .subscribe(() => {
      }, error => {
      });
  }

  //Get all Skills
  getSkills() {
    return this.http
      .get<{ skills: any }>(
        "http://localhost:3000/api/skill/get" 
      )
      .pipe(
        map(skillData => {
          return {
            skills: skillData.skills.map(skill => {
              return {
                id: skill._id,
                skillName: skill.skillName
              };
            }),
          };
        })
      )
      .subscribe(transformedSkillData => {
        this.skills = transformedSkillData.skills;
        this.skillsUpdated.next({
          skills: [...this.skills]
        });
      });
  }


getSkillUpdateListener() {
    return this.skillsUpdated.asObservable();
  }

}

