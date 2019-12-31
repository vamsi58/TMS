import {Answer} from './answer.model';

export interface Question {
  id : string;
  type: string;
  tags: string[];
  skills: string[];
  stmt: string;
  stmtHtml: string;
  options: Answer[];
  descAnswer: string;
  comment: string;
  status: string;
  complexity: string;
  createdBy: string;       
  updatedBy: string;       
  approvedBy: string;
}
