import BackdropImage from "@/components/BackdropImage";
import NotTranslatedSnackbar from "@/components/NotTranslatedSnackbar";
import TestResultTableRow from "@/components/TestResultTableRow";
import { topBarTitleState } from "@/services/atoms";
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

function Result() {
  const [progress, setProgress] = useState<Progress>({
    testId: "",
    length: 0,
    answers: [],
  });
  const [isShownSnackbar, setIsShownSnackbar] = useState<boolean>(false);
  const setTopBarTitle = useSetRecoilState<string>(topBarTitleState);

  const router = useRouter();

  const onClickBackspaceButton = () => {
    setTopBarTitle("Question Answer Portal");
    router.push("/");
  };

  /**
   * 正解した問題数(初期値:-1)
   */
  const correctLength: number = useMemo(() => {
    return progress.answers.length === 0
      ? -1
      : progress.answers.filter((answer: Answer) => answer.isCorrect).length;
  }, [progress]);

  useEffect(() => {
    const progressStr: string | null = localStorage.getItem("progress");
    if (!progressStr) return;
    setProgress(JSON.parse(progressStr));

    localStorage.removeItem("progress");
  }, []);

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="center" alignItems="center" pb={1}>
        <Button variant="contained" onClick={onClickBackspaceButton}>
          タイトルへ
        </Button>
      </Box>
      <Typography variant="h5" pb={2}>
        {progress.length > 0 && correctLength > -1 ? (
          `全${progress.length}問中${correctLength}問正解`
        ) : (
          <Skeleton />
        )}
      </Typography>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>
                <Typography variant="subtitle1">No.</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">結果</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(Array(progress.length).keys()).map((idx: number) => (
              <TestResultTableRow
                key={idx}
                testId={progress.testId}
                questionNumber={idx + 1}
                answer={progress.answers[idx]}
                setIsShownSnackbar={setIsShownSnackbar}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <BackdropImage />
      <NotTranslatedSnackbar
        open={isShownSnackbar}
        onClose={() => setIsShownSnackbar(false)}
      />
    </Box>
  );
}

export default Result;
