export type Answer = {
  choices: string[];
  correctChoices: string[];
};
export type Progress = {
  testId: string;
  testName: string;
  length: number;
  answers: Answer[];
};
