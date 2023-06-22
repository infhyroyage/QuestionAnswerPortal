import {
  GetQuestion,
  GetQuestionAnswer,
  PutEn2JaReq,
  PutEn2JaRes,
  Sentence,
} from "@/types/backend";
import {
  FirstTranslation,
  SecondTranslation,
  TestDoingProps,
} from "@/types/props";
import { Box, CircularProgress, Divider, Fab, Tooltip } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import ExplanationsDialog from "./ExplanationsDialog";
import BackdropImage from "./BackdropImage";
import NotTranslatedSnackbar from "./NotTranslatedSnackbar";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { isShownSystemErrorSnackbarState } from "@/services/atoms";
import { accessBackend } from "@/services/backend";
import { Progress } from "@/types/progress";
import { useAccount, useMsal } from "@azure/msal-react";
import TestDoingSelector from "./TestDoingSelector";
import TestSentences from "./TestSentences";

const INIT_QUESTION_NUMBER: number = 0;
const INIT_GET_QESTION_RES: GetQuestion = {
  subjects: [],
  choices: [],
  isMultiplied: false,
};
const INIT_GET_QESTION_ANSWER_RES: GetQuestionAnswer = {
  correctIdxes: [],
  explanations: {
    overall: [],
    incorrectChoices: {},
  },
  references: [],
};
const INIT_1ST_TRANSLATION: FirstTranslation = {
  subjects: [],
  choices: [],
};
const INIT_2ND_TRANSLATION: SecondTranslation = {
  overall: [],
  incorrectChoices: {},
};

function TestDoing({
  getTestRes,
  questionNumber,
  setQuestionNumber,
}: TestDoingProps) {
  const [getQuestionRes, setGetQuestionRes] =
    useState<GetQuestion>(INIT_GET_QESTION_RES);
  const [getQuestionAnswerRes, setGetQuestionAnswerRes] =
    useState<GetQuestionAnswer>(INIT_GET_QESTION_ANSWER_RES);
  const [firstTranslation, setFirstTranslation] =
    useState<FirstTranslation>(INIT_1ST_TRANSLATION);
  const [secondTranslation, setSecondTranslation] =
    useState<SecondTranslation>(INIT_2ND_TRANSLATION);
  const [selectedIdxes, setSelectedIdxes] = useState<number[]>([]);
  const [isLoadingSubmitButton, setIsLoadingSubmitButton] =
    useState<boolean>(false);
  const [isOpenedExplanationsDialog, setIsOpenedExplanationsDialog] =
    useState<boolean>(false);
  const [isShownSnackbar, setIsShownSnackbar] = useState<boolean>(false);
  const setIsShownSystemErrorSnackbar = useSetRecoilState<boolean>(
    isShownSystemErrorSnackbarState
  );

  const router = useRouter();

  const { instance, accounts } = useMsal();
  const accountInfo = useAccount(accounts[0] || {});

  const onClickSubmitButton = async () => {
    // 1つの問題に付き1回限りの回答とするため、2回目以降の回答ボタン押下はNOP
    if (isLoadingSubmitButton || getQuestionAnswerRes.correctIdxes.length > 0)
      return;

    setIsLoadingSubmitButton(true);

    try {
      // [GET] /tests/{testId}/questions/{questionNumber}/answerを実行
      const res: GetQuestionAnswer = await accessBackend<GetQuestionAnswer>(
        "GET",
        `/tests/${router.query.testId}/questions/${questionNumber}/answer`,
        instance,
        accountInfo
      );

      setGetQuestionAnswerRes(res);
    } catch (e) {
      console.error(e);
      setIsShownSystemErrorSnackbar(true);
    } finally {
      setIsLoadingSubmitButton(false);
    }
  };

  const onClickNextQuestionButton = async () => {
    if (questionNumber === getTestRes.length) {
      // 結果へ遷移
      router.push(`/result`);
    } else {
      // 次問題へ遷移
      setSecondTranslation(INIT_2ND_TRANSLATION);
      setGetQuestionAnswerRes(INIT_GET_QESTION_ANSWER_RES);
      setSelectedIdxes([]);
      setFirstTranslation(INIT_1ST_TRANSLATION);
      setGetQuestionRes(INIT_GET_QESTION_RES);
      setQuestionNumber(questionNumber + 1);
    }
  };

  /**
   * 正解した場合はtrue、未回答or不正解の場合はfalse
   */
  const isCorrect: boolean = useMemo(() => {
    // 未回答の場合はNOP
    if (getQuestionAnswerRes.correctIdxes.length === 0) return false;

    // 回答済の場合、正解/不正解の結果を判定し、Local Storageに保存
    const isCorrect: boolean =
      selectedIdxes.toString() === getQuestionAnswerRes.correctIdxes.toString();
    let updatedProgressState: Progress;
    const progressStr: string | null = localStorage.getItem("progress");
    if (!!progressStr) {
      const progress: Progress = JSON.parse(progressStr);
      updatedProgressState = {
        ...progress,
        answers: [...progress.answers, { selectedIdxes, isCorrect }],
      };
    } else {
      updatedProgressState = {
        testId: `${router.query.testId}`,
        length: getTestRes.length,
        answers: [{ selectedIdxes, isCorrect }],
      };
    }
    localStorage.setItem("progress", JSON.stringify(updatedProgressState));

    return isCorrect;
  }, [getQuestionAnswerRes, getTestRes, router, selectedIdxes]);

  // テスト開始後、questionNumberの更新ごとに[GET] /tests/{testId}/questions/{questionNumber}を実行
  useEffect(() => {
    if (router.isReady && questionNumber !== INIT_QUESTION_NUMBER) {
      (async () => {
        const res: GetQuestion = await accessBackend<GetQuestion>(
          "GET",
          `/tests/${router.query.testId}/questions/${questionNumber}`,
          instance,
          accountInfo
        );
        setGetQuestionRes(res);
      })();
    }
  }, [questionNumber, instance, accountInfo, router]);

  // [GET] /tests/{testId}/questions/{questionNumber}実行直後のみ問題文・選択肢を翻訳
  useEffect(() => {
    getQuestionRes.subjects.length &&
      getQuestionRes.choices.length &&
      (async () => {
        // subjects、choicesそれぞれの文字列に対して翻訳を複数回行わず、
        // subjects、choicesの順で配列を作成した文字列に対して翻訳を1回のみ行う
        const data: PutEn2JaReq = [
          ...getQuestionRes.subjects
            .filter(
              (subject: Sentence) =>
                !subject.isEscapedTranslation && !subject.isIndicatedImg
            )
            .map((subject: Sentence) => subject.sentence),
          ...getQuestionRes.choices
            .filter((choice: Sentence) => !choice.isEscapedTranslation)
            .map((choice: Sentence) => choice.sentence),
        ];

        try {
          // [PUT] /en2jpを実行
          const res: PutEn2JaRes = await accessBackend<
            PutEn2JaRes,
            PutEn2JaReq
          >("PUT", "/en2ja", instance, accountInfo, data);

          const subjects: string[] = getQuestionRes.subjects.map(
            (subject: Sentence) =>
              subject.isEscapedTranslation || subject.isIndicatedImg
                ? subject.sentence
                : (res.shift() as string)
          );
          const choices: string[] = getQuestionRes.choices.map(
            (choices: Sentence) =>
              choices.isEscapedTranslation
                ? choices.sentence
                : (res.shift() as string)
          );
          setFirstTranslation({ subjects, choices });
        } catch (e) {
          setIsShownSnackbar(true);
        }
      })();
  }, [accountInfo, getQuestionRes, instance]);

  return (
    <Box
      height="calc(100vh - 68px)"
      top={0}
      display="flex"
      flexDirection="column"
      position="relative"
    >
      <Box
        width="100%"
        height="60%"
        top={0}
        position="absolute"
        style={{ overflowY: "auto" }}
      >
        <TestSentences
          sentences={getQuestionRes.subjects}
          translatedSentences={firstTranslation.subjects}
        />
      </Box>
      <Tooltip title="回答する" placement="top">
        <span
          style={{
            position: "absolute",
            bottom: "calc(40% + 220px)",
            right: "20px",
          }}
        >
          <Fab
            color={
              getQuestionAnswerRes.correctIdxes.length === 0
                ? "info"
                : isCorrect
                ? "success"
                : "error"
            }
            onClick={onClickSubmitButton}
            disabled={selectedIdxes.length === 0}
            sx={{ zIndex: (theme) => theme.zIndex.tooltip }}
          >
            {getQuestionAnswerRes.correctIdxes.length === 0 ? (
              <LaunchIcon />
            ) : isCorrect ? (
              <CheckIcon />
            ) : (
              <ClearIcon />
            )}
          </Fab>
        </span>
      </Tooltip>
      {isLoadingSubmitButton && (
        <CircularProgress
          size={68}
          sx={{
            position: "absolute",
            bottom: "calc(40% + 214px)",
            right: "14px",
            zIndex: (theme) => theme.zIndex.tooltip,
          }}
        />
      )}
      <Tooltip title="解説を見る" placement="top">
        <span
          style={{
            position: "absolute",
            bottom: "calc(40% + 120px)",
            right: "20px",
          }}
        >
          <Fab
            color="info"
            disabled={
              getQuestionAnswerRes.explanations.overall.length === 0 &&
              Object.keys(getQuestionAnswerRes.explanations.incorrectChoices)
                .length === 0 &&
              getQuestionAnswerRes.references.length === 0
            }
            onClick={() => setIsOpenedExplanationsDialog(true)}
            sx={{ zIndex: (theme) => theme.zIndex.tooltip }}
          >
            <QuestionMarkIcon />
          </Fab>
        </span>
      </Tooltip>
      <Tooltip
        title={questionNumber === getTestRes.length ? "結果" : "次の問題へ"}
        placement="top"
      >
        <span
          style={{
            position: "absolute",
            bottom: "calc(40% + 20px)",
            right: "20px",
          }}
        >
          <Fab
            color="info"
            disabled={getQuestionAnswerRes.correctIdxes.length === 0}
            onClick={onClickNextQuestionButton}
            sx={{ zIndex: (theme) => theme.zIndex.tooltip }}
          >
            <NavigateNextIcon />
          </Fab>
        </span>
      </Tooltip>
      <Divider
        sx={{
          width: "100%",
          borderBottomWidth: "1px",
          position: "absolute",
          top: "60%",
        }}
      />
      <TestDoingSelector
        getQuestionRes={getQuestionRes}
        getQuestionAnswerRes={getQuestionAnswerRes}
        firstTranslation={firstTranslation}
        selectedIdxes={selectedIdxes}
        setSelectedIdxes={setSelectedIdxes}
        isSubmitted={
          isLoadingSubmitButton || getQuestionAnswerRes.correctIdxes.length > 0
        }
      />
      <ExplanationsDialog
        open={isOpenedExplanationsDialog}
        onClose={() => setIsOpenedExplanationsDialog(false)}
        choices={getQuestionRes.choices}
        explanations={getQuestionAnswerRes.explanations}
        references={getQuestionAnswerRes.references}
        secondTranslation={secondTranslation}
        setSecondTranslation={setSecondTranslation}
        translatedChoices={firstTranslation.choices}
      />
      {!isOpenedExplanationsDialog && <BackdropImage />}
      <NotTranslatedSnackbar
        open={isShownSnackbar}
        onClose={() => setIsShownSnackbar(false)}
      />
    </Box>
  );
}

export default TestDoing;
