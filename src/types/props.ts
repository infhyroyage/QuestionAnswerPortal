import { Dispatch, ReactNode, SetStateAction } from "react";
import { ExplanationSentences, IncorrectChoices, Sentence } from "./backend";

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

export type SecondTranslation =
  | {
      overall: string[];
      incorrectChoices: {
        [choiceIdx: string]: string[];
      };
    }
  | undefined;
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
