import { Dispatch, ReactNode, SetStateAction } from "react";
import { ExplanationSentences, Sentence } from "./backend";

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

export type NotTranslatedSnackbarProps = {
  open: boolean;
  onClose: () => void;
};

export type ThisLayoutProps = {
  children: ReactNode;
};
