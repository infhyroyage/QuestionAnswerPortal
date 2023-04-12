import { Box, Drawer, Fab, Skeleton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAccount, useMsal } from "@azure/msal-react";
import { GetQuestion, GetTest, Sentence } from "@/types/backend";
import { accessBackend } from "@/services/backend";
import ChoiceCard from "@/components/ChoiceCard";
import Image from "next/image";
import LaunchIcon from "@mui/icons-material/Launch";

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

function TestsTestIdQuestions() {
  const [questionNumber, setQuestionNumber] =
    useState<number>(INIT_QUESTION_NUMBER);
  const [getTestRes, setGetTestRes] = useState<GetTest>(INIT_GET_TEST_RES);
  const [getQuestionRes, setGetQuestionRes] =
    useState<GetQuestion>(INIT_GET_QESTION_RES);
  const [isSelectedChoices, setIsSelectedChoices] = useState<boolean[]>([]);
  const [isDisabledSubmitButton, setIsDisabledSubmitButton] =
    useState<boolean>(true);

  const router = useRouter();

  const { instance, accounts } = useMsal();
  const accountInfo = useAccount(accounts[0] || {});

  const GenerateOnClickChoiceCard = (idx: number) => () => {
    let updated: boolean[];
    if (getQuestionRes.isCorrectedMulti) {
      updated = [...isSelectedChoices];
      updated[idx] = !updated[idx];
    } else {
      updated = new Array(getQuestionRes.choices.length).fill(false);
      updated[idx] = true;
    }
    setIsSelectedChoices(updated);
    setIsDisabledSubmitButton(false);
  };

  useEffect(() => {
    const progressStr: string | null = localStorage.getItem("progress");
    if (!progressStr) return;

    const progress = JSON.parse(progressStr);
    setQuestionNumber(progress.answers.length + 1);
    setGetTestRes({ testName: progress.testName, length: progress.length });
  }, []);

  // クライアントサイドでの初回レンダリング時のみ[GET] /tests/{testId}/questions/{questionNumber}を実行
  useEffect(() => {
    if (router.isReady && questionNumber !== INIT_QUESTION_NUMBER) {
      const { testId } = router.query;
      (async () => {
        const res: GetQuestion = await accessBackend<GetQuestion>(
          "GET",
          `/tests/${testId}/questions/${questionNumber}`,
          instance,
          accountInfo
        );
        setGetQuestionRes(res);
        setIsSelectedChoices(new Array(res.choices.length).fill(false));
      })();
    }
  }, [questionNumber, instance, accountInfo, router]);

  return (
    <>
      <Box
        sx={{ flexGrow: 1, padding: 2, position: "relative", minHeight: "60%" }}
      >
        <Typography variant="h5" pb={1}>
          {getTestRes.testName.length > 0 && getTestRes.length > 0 ? (
            `${getTestRes.testName} 問題${questionNumber} (全${getTestRes.length}問)`
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
        <Fab
          color="primary"
          disabled={isDisabledSubmitButton}
          sx={{
            position: "absolute",
            top: 12,
            right: 20,
          }}
        >
          <LaunchIcon />
        </Fab>
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
                isSelected={isSelectedChoices[idx]}
                choice={choice}
                onClick={GenerateOnClickChoiceCard(idx)}
              />
            ))
          ) : (
            <>
              <ChoiceCard isSelected={false} />
              <ChoiceCard isSelected={false} />
            </>
          )}
        </Stack>
      </Drawer>
    </>
  );
}

export default TestsTestIdQuestions;
