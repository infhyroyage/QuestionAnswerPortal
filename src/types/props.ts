import { ReactNode } from "react";
import { IncorrectChoices, Sentence } from "./backend";

export type ApplyMUIProps = {
  children: ReactNode;
};

export type ChoiceCardProps = {
  isSelected: boolean;
  choice?: Sentence;
  translatedText?: string;
  onClick?: () => void;
};

export type TestChoiceContentProps = {
  choices: Sentence[];
  isCorrectedMulti: boolean;
  translatedChoices: string[] | undefined;
  selectedIdxes: number[];
  correctIdxes: number[];
  isDisabledChoiceInput: boolean;
  onChangeChoiceInput: (idx: number, isCorrectedMulti: boolean) => void;
};

export type TestExplanationIncorrectChoiceContentProps = {
  choices: Sentence[];
  translatedChoices: string[] | undefined;
  incorrectChoices: IncorrectChoices;
  translatedIncorrectChoices: string[] | undefined;
};

export type TestSentenceContentProps = {
  sentences: Sentence[];
  translatedSentences: string[] | undefined;
};

export type TestTranslationErrorContentProps = {
  sentences: Sentence[];
  setTranslatedSentences: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >;
  setIsNotTranslatedSentences: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ThisLayoutProps = {
  children: ReactNode;
};
