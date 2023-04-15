import {
  Box,
  CircularProgress,
  Drawer,
  Fab,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useAccount, useMsal } from "@azure/msal-react";
import {
  GetQuestion,
  GetQuestionAnswer,
  GetTest,
  Sentence,
} from "@/types/backend";
import { accessBackend } from "@/services/backend";
import ChoiceCard from "@/components/ChoiceCard";
import Image from "next/image";
import { Progress } from "@/types/progress";
import LaunchIcon from "@mui/icons-material/Launch";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const INIT_QUESTION_NUMBER: number = 0;
const INIT_GET_TEST_RES: GetTest = {
  testName: "",
  length: 0,
};
const INIT_GET_QESTION_RES: GetQuestion = {
  subjects: [],
  choices: [],
  isCorrectedMulti: false,
};
const INIT_GET_QESTION_ANSWER_RES: GetQuestionAnswer = {
  correctIdxes: [],
  explanations: {
    overall: [],
    incorrectChoices: {},
  },
  references: [],
};

function TestsTestIdQuestions() {
  const [questionNumber, setQuestionNumber] =
    useState<number>(INIT_QUESTION_NUMBER);
  const [getTestRes, setGetTestRes] = useState<GetTest>(INIT_GET_TEST_RES);
  const [getQuestionRes, setGetQuestionRes] =
    useState<GetQuestion>(INIT_GET_QESTION_RES);
  const [getQuestionAnswerRes, setGetQuestionAnswerRes] =
    useState<GetQuestionAnswer>(INIT_GET_QESTION_ANSWER_RES);
  const [selectedIdxes, setSelectedIdxes] = useState<number[]>([]);
  const [isLoadingSubmitButton, setIsLoadingSubmitButton] =
    useState<boolean>(false);

  const router = useRouter();

  const { instance, accounts } = useMsal();
  const accountInfo = useAccount(accounts[0] || {});

  const GenerateOnClickChoiceCard = (idx: number) => () => {
    // 1つの問題に付き1回限りの回答とするため、回答済の場合はNOP
    if (isLoadingSubmitButton || getQuestionAnswerRes.correctIdxes.length > 0)
      return;

    let updated: number[];
    if (getQuestionRes.isCorrectedMulti) {
      const updatedSelectedIdxes: number[] = selectedIdxes.includes(idx)
        ? selectedIdxes.filter((selectedIdx: number) => selectedIdx !== idx)
        : [...selectedIdxes, idx];
      updated = updatedSelectedIdxes.sort((a, b) =>
        a === b ? 0 : a < b ? -1 : 1
      );
    } else {
      updated = [idx];
    }
    setSelectedIdxes(updated);
  };

  const onClickSubmitButton = async () => {
    // 1つの問題に付き1回限りの回答とするため、2回目以降の回答ボタン押下はNOP
    if (isLoadingSubmitButton || getQuestionAnswerRes.correctIdxes.length > 0)
      return;

    setIsLoadingSubmitButton(true);

    // [GET] /tests/{testId}/questions/{questionNumber}/answerを実行
    const res: GetQuestionAnswer = await accessBackend<GetQuestionAnswer>(
      "GET",
      `/tests/${router.query.testId}/questions/${questionNumber}/answer`,
      instance,
      accountInfo
    );

    // 回答結果をLocal Storageに一時保存
    const progressStr: string | null = localStorage.getItem("progress");
    if (!progressStr) return;
    const progress: Progress = JSON.parse(progressStr);
    const choices: string[] = selectedIdxes.map(
      (selectedIdx: number) => getQuestionRes.choices[selectedIdx].sentence
    );
    const correctChoices: string[] = res.correctIdxes.map(
      (correctIdx: number) => getQuestionRes.choices[correctIdx].sentence
    );
    const updatedProgressState: Progress = {
      ...progress,
      answers: [...progress.answers, { choices, correctChoices }],
    };
    localStorage.setItem("progress", JSON.stringify(updatedProgressState));

    setGetQuestionAnswerRes(res);
    setIsLoadingSubmitButton(false);
  };

  const onClickNextQuestionButton = async () => {
    if (questionNumber === getTestRes.length) {
      // 結果へ遷移
      router.push(`/tests/${router.query.testId}/result`);
    } else {
      // 次問題へ遷移
      setGetQuestionAnswerRes(INIT_GET_QESTION_ANSWER_RES);
      setSelectedIdxes([]);
      setGetQuestionRes(INIT_GET_QESTION_RES);
      setQuestionNumber(questionNumber + 1);
    }
  };

  /**
   * 正解した場合はtrue、未回答or不正解の場合はfalse
   */
  const isCollect: boolean = useMemo(() => {
    if (getQuestionAnswerRes.correctIdxes.length === 0) return false;
    return (
      selectedIdxes.toString() === getQuestionAnswerRes.correctIdxes.toString()
    );
  }, [getQuestionAnswerRes, selectedIdxes]);

  useEffect(() => {
    const progressStr: string | null = localStorage.getItem("progress");
    if (!progressStr) return;

    const progress: Progress = JSON.parse(progressStr);
    setQuestionNumber(progress.answers.length + 1);
    setGetTestRes({ testName: progress.testName, length: progress.length });
  }, []);

  // クライアントサイドでの初回レンダリング時のみ[GET] /tests/{testId}/questions/{questionNumber}を実行
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

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          padding: 2,
          height: "calc(60vh - 68px)",
          position: "relative",
        }}
      >
        <Typography variant="h5" pb={1}>
          {getTestRes.testName.length > 0 && getTestRes.length > 0 ? (
            `${getTestRes.testName} 問題${questionNumber} (全${
              getTestRes.length
            }問)${getQuestionRes.isCorrectedMulti ? " ※複数選択" : ""}`
          ) : (
            <Skeleton />
          )}
        </Typography>
        {getQuestionRes.subjects.length > 0 ? (
          getQuestionRes.subjects.map((subject: Sentence, idx: number) => (
            <Box key={idx} pt={2}>
              {subject.isIndicatedImg ? (
                <Image src={subject.sentence} alt={`${idx + 1}th Picture`} />
              ) : (
                <>
                  <Typography variant="body1" color="text.primary">
                    {subject.sentence || <Skeleton />}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <Skeleton />
                  </Typography>
                </>
              )}
            </Box>
          ))
        ) : (
          <>
            <Box pt={2}>
              <Typography variant="body1" color="text.primary">
                <Skeleton />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Skeleton />
              </Typography>
            </Box>
            <Box pt={2}>
              <Skeleton variant="rectangular" width="640px" height="480px" />
            </Box>
          </>
        )}
        <Tooltip
          title={questionNumber === getTestRes.length ? "結果" : "次の問題へ"}
          placement="top"
        >
          <span
            style={{
              position: "absolute",
              bottom: "100px",
              right: "20px",
            }}
          >
            <Fab
              onClick={onClickNextQuestionButton}
              disabled={getQuestionAnswerRes.correctIdxes.length === 0}
            >
              <NavigateNextIcon />
            </Fab>
          </span>
        </Tooltip>
        <Tooltip title="回答" placement="top">
          <span
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
            }}
          >
            <Fab
              color={
                getQuestionAnswerRes.correctIdxes.length === 0
                  ? "primary"
                  : isCollect
                  ? "success"
                  : "error"
              }
              onClick={onClickSubmitButton}
              disabled={selectedIdxes.length === 0}
            >
              {getQuestionAnswerRes.correctIdxes.length === 0 ? (
                <LaunchIcon />
              ) : isCollect ? (
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
              bottom: "14px",
              right: "14px",
              zIndex: 1,
            }}
          />
        )}
      </Box>
      <Drawer
        variant="permanent"
        anchor="bottom"
        sx={{ height: "40%", [`& .MuiDrawer-paper`]: { height: "40%" } }}
      >
        <Stack spacing={2} p={2}>
          {getQuestionRes.choices.length > 0 ? (
            getQuestionRes.choices.map((choice: Sentence, idx: number) => (
              <ChoiceCard
                key={idx}
                isSelected={selectedIdxes.includes(idx)}
                isCorrect={
                  getQuestionAnswerRes.correctIdxes.length > 0 &&
                  selectedIdxes.includes(idx) &&
                  getQuestionAnswerRes.correctIdxes.includes(idx)
                }
                isIncorrect={
                  getQuestionAnswerRes.correctIdxes.length > 0 &&
                  selectedIdxes.includes(idx) &&
                  !getQuestionAnswerRes.correctIdxes.includes(idx)
                }
                isMissed={
                  getQuestionAnswerRes.correctIdxes.length > 0 &&
                  !selectedIdxes.includes(idx) &&
                  getQuestionAnswerRes.correctIdxes.includes(idx)
                }
                choice={choice}
                onClick={GenerateOnClickChoiceCard(idx)}
              />
            ))
          ) : (
            <>
              <ChoiceCard />
              <ChoiceCard />
            </>
          )}
        </Stack>
      </Drawer>
    </>
  );
}

export default TestsTestIdQuestions;
