import {Answer} from './answer.model';

export interface Question {
  id : string;
  type: string;
  category: string;
  competency: string;
  text: string;
  textHtml: string;
  options: Answer[];
  comment: string;
  status: string;
  complexity: string;
  createdBy: string;       
  updatedBy: string;       
  approvedBy: string;
}
