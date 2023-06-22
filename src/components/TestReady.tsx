import { TestReadyProps } from "@/types/props";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function TestReady({ getTestRes, setQuestionNumber }: TestReadyProps) {
  const [isSavedOtherTest, setIsSavedOtherTest] = useState<boolean>(false);
  const [isSavedSameTest, setIsSavedSameTest] = useState<boolean>(false);

  const router = useRouter();

  const onClickStartButton = () => {
    // 別テストの回答データをlocalstorageから削除
    if (isSavedOtherTest) localStorage.removeItem("progress");

    const progressStr: string | null = localStorage.getItem("progress");
    const startQuestionNumber = !!progressStr
      ? JSON.parse(progressStr).answers.length + 1
      : 1;
    setQuestionNumber(startQuestionNumber);
  };

  useEffect(() => {
    if (router.isReady) {
      const progressStr: string | null = localStorage.getItem("progress");
      setIsSavedOtherTest(
        !!progressStr && JSON.parse(progressStr).testId !== router.query.testId
      );
      setIsSavedSameTest(
        !!progressStr &&
          JSON.parse(progressStr).testId === router.query.testId &&
          JSON.parse(progressStr).answers.length > 0
      );
    }
  }, [router]);

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button
          variant="contained"
          onClick={onClickStartButton}
          disabled={getTestRes.testName.length === 0 || getTestRes.length === 0}
        >
          {isSavedOtherTest
            ? "削除して開始"
            : isSavedSameTest
            ? "再開"
            : "開始"}
        </Button>
      </Box>
      {isSavedOtherTest && (
        <Typography style={{ color: "red" }}>
          ※最後に回答した別テストの回答データを削除して開始します
        </Typography>
      )}
      {isSavedSameTest && (
        <Typography style={{ color: "red" }}>
          ※最後に回答した問題の直後から開始します
        </Typography>
      )}
    </Box>
  );
}

export default TestReady;
