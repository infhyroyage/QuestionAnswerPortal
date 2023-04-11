import { accessBackend } from "@/services/backend";
import { GetTest } from "@/types/backend";
import { useAccount, useMsal } from "@azure/msal-react";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function TestsTestId() {
  const [storedProgress, setStoredProgress] = useState<{
    isResumed: boolean;
    isStartedOther: boolean;
  }>({ isResumed: false, isStartedOther: false });
  const [getTestRes, setGetTestRes] = useState<GetTest>({
    testName: "",
    length: 0,
  });

  const router = useRouter();

  const { instance, accounts } = useMsal();
  const accountInfo = useAccount(accounts[0] || {});

  useEffect(() => {
    if (router.isReady) {
      const { testId } = router.query;
      const progressStr: string | null = localStorage.getItem("progress");

      const isStartedOther: boolean =
        !!progressStr && JSON.parse(progressStr).testId !== testId;
      const isResumed: boolean =
        !!progressStr &&
        JSON.parse(progressStr).testId === testId &&
        JSON.parse(progressStr).answers.length > 0;
      setStoredProgress({ isResumed, isStartedOther });
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

  const onClickStartButton = () => {
    const { testId } = router.query;

    if (!storedProgress.isResumed) {
      localStorage.setItem(
        "progress",
        JSON.stringify({
          testId,
          answers: [],
        })
      );
    }
    // router.push(`/tests/${testId}/questions`);
  };

  return (
    <>
      <Typography variant="h5" pb={3}>
        {getTestRes.testName.length > 0 && getTestRes.length > 0 ? (
          `${getTestRes.testName} (全${getTestRes.length}問)`
        ) : (
          <Skeleton />
        )}
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button
          variant="contained"
          onClick={onClickStartButton}
          disabled={getTestRes.testName.length === 0 || getTestRes.length === 0}
        >
          開始
        </Button>
        {storedProgress.isStartedOther && (
          <Typography style={{ color: "red" }}>
            ※最後に回答した別テストの回答データを削除して開始します
          </Typography>
        )}
        {storedProgress.isResumed && (
          <Typography style={{ color: "red" }}>
            ※最後に回答した問題の直後から開始します
          </Typography>
        )}
      </Box>
    </>
  );
}

export default TestsTestId;
