import {
  Card,
  CardContent,
  Collapse,
  IconButton,
  Skeleton,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { memo, useEffect, useState } from "react";
import { TestResultTableRowProps } from "../types/props";
import {
  GetQuestion,
  GetQuestionAnswer,
  PutEn2JaReq,
  PutEn2JaRes,
  Sentence,
} from "../types/backend";
import { accessBackend } from "../services/backend";
import { useAccount, useMsal } from "@azure/msal-react";
import TestSentences from "./TestSentences";
import LoadingCenter from "./LoadingCenter";
import { useSetRecoilState } from "recoil";
import { isShownSystemErrorSnackbarState } from "../services/atoms";

type Responses = Pick<
  GetQuestion & GetQuestionAnswer,
  "subjects" | "choices" | "correctIdxes" | "explanations"
>;
type Translation = {
  subjects: string[];
  selectedChoices: string[];
  correctChoices: string[];
  overall: string[];
};
const INIT_RESPONSES: Responses = {
  subjects: [],
  choices: [],
  correctIdxes: [],
  explanations: {
    overall: [],
    incorrectChoices: {},
  },
};
const INIT_TRANSLATION: Translation = {
  subjects: [],
  selectedChoices: [],
  correctChoices: [],
  overall: [],
};

function TestResultTableRow({
  testId,
  questionNumber,
  answer,
  setIsShownSnackbar,
}: TestResultTableRowProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [responses, setResponses] = useState<Responses>(INIT_RESPONSES);
  const [translation, setTranslation] = useState<Translation>(INIT_TRANSLATION);
  const setIsShownSystemErrorSnackbar = useSetRecoilState<boolean>(
    isShownSystemErrorSnackbarState
  );

  const { instance, accounts } = useMsal();
  const accountInfo = useAccount(accounts[0] || {});

  // 展開後、以下のAPIを並列実行
  // * [GET] /tests/{testId}/questions/{questionNumber}
  // * [GET] /tests/{testId}/questions/{questionNumber}/answer
  useEffect(() => {
    if (
      open &&
      responses.subjects.length === 0 &&
      responses.choices.length === 0 &&
      responses.correctIdxes.length === 0 &&
      responses.explanations.overall.length === 0
    ) {
      (async () => {
        const getQuestionPromise: Promise<GetQuestion> =
          accessBackend<GetQuestion>(
            "GET",
            `/tests/${testId}/questions/${questionNumber}`,
            instance,
            accountInfo
          );
        const getQuestionAnswerPromise: Promise<GetQuestionAnswer> =
          accessBackend<GetQuestionAnswer>(
            "GET",
            `/tests/${testId}/questions/${questionNumber}/answer`,
            instance,
            accountInfo
          );

        try {
          const [getQuestionRes, getQuestionAnswerRes] = await Promise.all<
            [Promise<GetQuestion>, Promise<GetQuestionAnswer>]
          >([getQuestionPromise, getQuestionAnswerPromise]);
          setResponses({
            subjects: getQuestionRes.subjects,
            choices: getQuestionRes.choices,
            correctIdxes: getQuestionAnswerRes.correctIdxes,
            explanations: getQuestionAnswerRes.explanations,
          });
        } catch (e) {
          console.error(e);
          setIsShownSystemErrorSnackbar(true);
        }
      })();
    }
  }, [
    open,
    instance,
    accountInfo,
    testId,
    questionNumber,
    responses,
    setIsShownSystemErrorSnackbar,
  ]);

  // [GET] /tests/{testId}/questions/{questionNumber}実行直後のみ問題文・選択肢を翻訳
  useEffect(() => {
    responses.subjects.length &&
      responses.choices.length &&
      responses.correctIdxes.length &&
      responses.explanations.overall.length &&
      translation.subjects.length === 0 &&
      translation.selectedChoices.length === 0 &&
      translation.correctChoices.length === 0 &&
      translation.overall.length === 0 &&
      (async () => {
        // subjects、choicesそれぞれの文字列に対して翻訳を複数回行わず、
        // subjects、choicesの順で配列を作成した文字列に対して翻訳を1回のみ行う
        const data: PutEn2JaReq = [
          ...responses.subjects
            .filter(
              (subject: Sentence) =>
                !subject.isEscapedTranslation && !subject.isIndicatedImg
            )
            .map((subject: Sentence) => subject.sentence),
          ...responses.choices
            .filter(
              (choice: Sentence, idx: number) =>
                !choice.isEscapedTranslation &&
                answer.selectedIdxes.includes(idx)
            )
            .map((choice: Sentence) => choice.sentence),
          ...responses.choices
            .filter(
              (choice: Sentence, idx: number) =>
                !choice.isEscapedTranslation &&
                responses.correctIdxes.includes(idx)
            )
            .map((choice: Sentence) => choice.sentence),
          ...responses.explanations.overall
            .filter(
              (sentence: Sentence) =>
                !sentence.isEscapedTranslation && !sentence.isIndicatedImg
            )
            .map((sentence: Sentence) => sentence.sentence),
        ];

        try {
          // [PUT] /en2jpを実行
          const res: PutEn2JaRes = await accessBackend<
            PutEn2JaRes,
            PutEn2JaReq
          >("PUT", "/en2ja", instance, accountInfo, data);

          const subjects: string[] = responses.subjects.map(
            (subject: Sentence) =>
              subject.isEscapedTranslation || subject.isIndicatedImg
                ? subject.sentence
                : (res.shift() as string)
          );
          const selectedChoices: string[] = responses.choices
            .filter((_, idx: number) => answer.selectedIdxes.includes(idx))
            .map((choices: Sentence) =>
              choices.isEscapedTranslation
                ? choices.sentence
                : (res.shift() as string)
            );
          const correctChoices: string[] = responses.choices
            .filter((_, idx: number) => responses.correctIdxes.includes(idx))
            .map((choices: Sentence) =>
              choices.isEscapedTranslation
                ? choices.sentence
                : (res.shift() as string)
            );
          const overall: string[] = responses.explanations.overall.map(
            (sentence: Sentence) =>
              sentence.isEscapedTranslation || sentence.isIndicatedImg
                ? sentence.sentence
                : (res.shift() as string)
          );
          setTranslation({
            subjects,
            selectedChoices,
            correctChoices,
            overall,
          });
        } catch (e) {
          setIsShownSnackbar(true);
        }
      })();
  }, [
    accountInfo,
    answer,
    instance,
    responses,
    setIsShownSnackbar,
    translation,
  ]);

  return (
    <>
      <TableRow
        sx={
          answer.isCorrect
            ? {}
            : { backgroundColor: "rgba(229, 115, 115, 0.3)" }
        }
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle1">{questionNumber}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle1">
            {answer.isCorrect ? "正解" : "不正解"}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {responses.subjects.length &&
            responses.choices.length &&
            responses.correctIdxes.length &&
            responses.explanations.overall.length ? (
              <>
                <Typography variant="h6" pt={2}>
                  問題文
                </Typography>
                <TestSentences
                  sentences={responses.subjects}
                  translatedSentences={translation.subjects}
                />
                <Typography variant="h6">選んだ選択肢</Typography>
                <Stack spacing={2} p={2}>
                  {answer.selectedIdxes.map(
                    (selectedIdx: number, idx: number) => (
                      <Card
                        key={selectedIdx}
                        sx={{
                          width: "100%",
                          transition: "background-color 0.2s",
                        }}
                      >
                        <CardContent
                          sx={{
                            padding: 2,
                            "&:last-child": { paddingBottom: 2 },
                          }}
                        >
                          <Typography
                            variant="body1"
                            color="text.primary"
                            fontWeight="bold"
                          >
                            {responses.choices[selectedIdx].sentence}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight="bold"
                          >
                            {translation.selectedChoices.length ? (
                              translation.selectedChoices[idx]
                            ) : (
                              <Skeleton />
                            )}
                          </Typography>
                        </CardContent>
                      </Card>
                    )
                  )}
                </Stack>
                <Typography variant="h6">正解の選択肢</Typography>
                <Stack spacing={2} p={2}>
                  {responses.correctIdxes.map(
                    (correctIdx: number, idx: number) => (
                      <Card
                        key={correctIdx}
                        sx={{
                          width: "100%",
                          transition: "background-color 0.2s",
                        }}
                      >
                        <CardContent
                          sx={{
                            padding: 2,
                            "&:last-child": { paddingBottom: 2 },
                          }}
                        >
                          <Typography
                            variant="body1"
                            color="text.primary"
                            fontWeight="bold"
                          >
                            {responses.choices[correctIdx].sentence}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight="bold"
                          >
                            {translation.correctChoices.length ? (
                              translation.correctChoices[idx]
                            ) : (
                              <Skeleton />
                            )}
                          </Typography>
                        </CardContent>
                      </Card>
                    )
                  )}
                </Stack>
                <Typography variant="h6">解説</Typography>
                <TestSentences
                  sentences={responses.explanations.overall}
                  translatedSentences={translation.overall}
                />
              </>
            ) : (
              <LoadingCenter />
            )}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default memo(TestResultTableRow);
