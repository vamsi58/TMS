import { Tag } from './../models/tag.model';
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";


import {
    map,
} from "rxjs/operators";


@Injectable({
    providedIn: 'root'
})
export class TagService {


    private tags: Tag[] = [];
    private tagsUpdated = new Subject<{ tags: Tag[]; }>();
    constructor(private http: HttpClient) { }

    //Add Tag
    createTag(tagName: string) {
        const Tag: Tag = { id: "dummyId", tagName: tagName };

        this.http
            .post("http://localhost:3000/api/tag/add", Tag)
            .subscribe(() => {
            }, error => {
            });
    }

    //Get all Tags
    getTags() {
        return this.http
            .get<{ tags: any }>(
                "http://localhost:3000/api/tag/get"
            )
            .pipe(
                map(tagData => {
                    return {
                        tags: tagData.tags.map(tag => {
                            return {
                                id: tag._id,
                                tagName: tag.tagName
                            };
                        }),
                    };
                })
            )
            .subscribe(transformedTagData => {
                this.tags = transformedTagData.tags;
                this.tagsUpdated.next({
                    tags: [...this.tags]
                });
            });
    }

    getTagUpdateListener() {
        return this.tagsUpdated.asObservable();
    }

}