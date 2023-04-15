import { Answer, Progress } from "@/types/progress";
import { Box, Skeleton, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

function TestsTestIdResult() {
  const [progress, setProgress] = useState<Progress>({
    testId: "",
    testName: "",
    length: 0,
    answers: [],
  });

  /**
   * 正解した問題数(初期値:-1)
   */
  const correctLength: number = useMemo(() => {
    return progress.answers.length === 0
      ? -1
      : progress.answers.filter(
          (answer: Answer) =>
            answer.choices.toString() === answer.correctChoices.toString()
        ).length;
  }, [progress]);

  useEffect(() => {
    const progressStr: string | null = localStorage.getItem("progress");
    if (!progressStr) return;
    setProgress(JSON.parse(progressStr));

    localStorage.removeItem("progress");
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h5" pb={1}>
        {progress.testName.length > 0 &&
        progress.length > 0 &&
        correctLength > -1 ? (
          `${progress.testName} (全${progress.length}問中${correctLength}問正解)`
        ) : (
          <Skeleton />
        )}
      </Typography>
    </Box>
  );
}

export default TestsTestIdResult;
