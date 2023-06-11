import { topBarTitleState } from "@/states/TopBarTitle";
import { Answer, Progress } from "@/types/progress";
import {
  Box,
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useSetRecoilState } from "recoil";

function TestsTestIdResult() {
  const [progress, setProgress] = useState<Progress>({
    testId: "",
    testName: "",
    length: 0,
    answers: [],
  });
  const setTopBarTitle = useSetRecoilState<string>(topBarTitleState);

  const router = useRouter();

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

  const onClickBackspaceButton = () => {
    setTopBarTitle("Question Answer Portal");
    router.push("/");
  };

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
      <Box display="flex" justifyContent="center" alignItems="center" pb={2}>
        <Button variant="contained" onClick={onClickBackspaceButton}>
          タイトルへ
        </Button>
      </Box>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle1">No.</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">選んだ選択肢</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">正解の選択肢</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {progress.answers.map((answer: Answer, idx: number) => (
              <TableRow
                key={idx}
                sx={
                  answer.choices.toString() === answer.correctChoices.toString()
                    ? {}
                    : { backgroundColor: "rgba(229, 115, 115, 0.3)" }
                }
              >
                <TableCell>{idx + 1}</TableCell>
                <TableCell>
                  {answer.choices.length > 1 ? (
                    <ul>
                      {answer.choices.map(
                        (choice: string, choiceIdx: number) => (
                          <li key={choiceIdx}>{choice}</li>
                        )
                      )}
                    </ul>
                  ) : (
                    answer.choices[0]
                  )}
                </TableCell>
                <TableCell>
                  {answer.correctChoices.length > 1 ? (
                    <ul>
                      {answer.correctChoices.map(
                        (correctChoice: string, correctChoiceIdx: number) => (
                          <li key={correctChoiceIdx}>{correctChoice}</li>
                        )
                      )}
                    </ul>
                  ) : (
                    answer.correctChoices[0]
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TestsTestIdResult;
