import { Dispatch, ReactNode, SetStateAction } from "react";
import {
  ExplanationSentences,
  GetQuestion,
  GetQuestionAnswer,
  GetTest,
  Sentence,
} from "./backend";
import { Answer } from "./progress";

export type ApplyMSALProps = {
  children: ReactNode;
};

export type ApplyMUIProps = {
  children: ReactNode;
};

export type ChoiceCardProps = {
  isSelected?: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  isMissed?: boolean;
  choice?: Sentence;
  translatedText?: string;
  onClick?: () => void;
};

export type SecondTranslation = {
  overall: string[];
  incorrectChoices: {
    [choiceIdx: string]: string[];
  };
};
export type ExplanationsDialogProps = {
  open: boolean;
  onClose: () => void;
  choices: Sentence[];
  explanations: ExplanationSentences;
  references: string[];
  secondTranslation: SecondTranslation;
  setSecondTranslation: Dispatch<SetStateAction<SecondTranslation>>;
  translatedChoices?: string[];
};

export type NotTranslatedSnackbarProps = {
  open: boolean;
  onClose: () => void;
};

export type TestDoingProps = {
  getTestRes: GetTest;
  questionNumber: number;
  setQuestionNumber: Dispatch<SetStateAction<number>>;
};

export type FirstTranslation = {
  subjects: string[];
  choices: string[];
};
export type TestDoingSelectorProps = {
  getQuestionRes: GetQuestion;
  getQuestionAnswerRes: GetQuestionAnswer;
  firstTranslation: FirstTranslation;
  selectedIdxes: number[];
  setSelectedIdxes: Dispatch<SetStateAction<number[]>>;
  isSubmitted: boolean;
};

export type TestReadyProps = {
  getTestRes: GetTest;
  setQuestionNumber: Dispatch<SetStateAction<number>>;
};

export type TestResultTableRowProps = {
  testId: string;
  questionNumber: number;
  answer: Answer;
  setIsShownSnackbar: Dispatch<SetStateAction<boolean>>;
};

export type TestSubjectsProps = {
  subjects: Sentence[];
  translatedSubjects: string[];
};
