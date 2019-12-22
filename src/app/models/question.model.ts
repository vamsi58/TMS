import {Answer} from './answer.model';

export interface Question {
  id : string;
  quesid: string;
  questype: string;
  quesCat: string;
  quesSubCat: string;
  question: string;
  quesFormatted: string;
  quesAnswers: Answer[];
  quesReason: string;
  quesAproved: boolean;
  quesComplex: string;
}
