import { accessBackend } from "@/services/backend";
import { topBarTitleState } from "@/states/TopBarTitle";
import { GetTest } from "@/types/backend";
import { Progress } from "@/types/progress";
import { useAccount, useMsal } from "@azure/msal-react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

const INIT_QUESTION_NUMBER: number = 0;

function TestsTestId() {
  const [questionNumber, setQuestionNumber] =
    useState<number>(INIT_QUESTION_NUMBER);
  const [isStartedOther, setIsStartedOther] = useState<boolean>(false);
  const [getTestRes, setGetTestRes] = useState<GetTest>({
    testName: "",
    length: 0,
  });
  const setTopBarTitle = useSetRecoilState<string>(topBarTitleState);

  const router = useRouter();

  const { instance, accounts } = useMsal();
  const accountInfo = useAccount(accounts[0] || {});

  const onClickStartButton = () => {
    const { testId } = router.query;

    if (questionNumber === 1) {
      const initProgress: Progress = {
        testId: `${testId}`,
        testName: getTestRes.testName,
        length: getTestRes.length,
        answers: [],
      };
      localStorage.setItem("progress", JSON.stringify(initProgress));
    }

    setTopBarTitle(
      `(${questionNumber}/${getTestRes.length}) ${getTestRes.testName}`
    );
    router.push(`/tests/${testId}/questions`);
  };

  useEffect(() => {
    if (router.isReady) {
      const { testId } = router.query;
      const progressStr: string | null = localStorage.getItem("progress");

      setIsStartedOther(
        !!progressStr && JSON.parse(progressStr).testId !== testId
      );
      setQuestionNumber(
        !!progressStr && JSON.parse(progressStr).testId === testId
          ? JSON.parse(progressStr).answers.length + 1
          : 1
      );
    }
  }, [router]);

  // クライアントサイドでの初回レンダリング時のみ[GET] /tests/{testId}を実行
  useEffect(() => {
    if (router.isReady) {
      const { testId } = router.query;
      (async () => {
        const res: GetTest = await accessBackend<GetTest>(
          "GET",
          `/tests/${testId}`,
          instance,
          accountInfo
        );
        setGetTestRes(res);
      })();
    }
  }, [accountInfo, instance, router]);

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button
          variant="contained"
          onClick={onClickStartButton}
          disabled={
            getTestRes.testName.length === 0 ||
            getTestRes.length === 0 ||
            questionNumber === INIT_QUESTION_NUMBER
          }
        >
          {isStartedOther
            ? "削除して開始"
            : questionNumber > 1
            ? "再開"
            : "開始"}
        </Button>
      </Box>
      {isStartedOther && (
        <Typography style={{ color: "red" }}>
          ※最後に回答した別テストの回答データを削除して開始します
        </Typography>
      )}
      {questionNumber > 1 && (
        <Typography style={{ color: "red" }}>
          ※最後に回答した問題の直後から開始します
        </Typography>
      )}
    </Box>
  );
}

export default TestsTestId;
