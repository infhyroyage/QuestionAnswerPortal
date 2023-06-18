export type Answer = {
  selectedIdxes: number[];
  isCorrect: boolean;
};
export type Progress = {
  testId: string;
  length: number;
  answers: Answer[];
};
