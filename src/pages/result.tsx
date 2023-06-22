import BackdropImage from "@/components/BackdropImage";
import NotTranslatedSnackbar from "@/components/NotTranslatedSnackbar";
import TestResultTableRow from "@/components/TestResultTableRow";
import {
  isShownSystemErrorSnackbarState,
  topBarTitleState,
} from "@/services/atoms";
import { accessBackend } from "@/services/backend";
import { GetTest } from "@/types/backend";
import { Answer, Progress } from "@/types/progress";
import { useAccount, useMsal } from "@azure/msal-react";
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

const INIT_GET_TEST_RES: GetTest = {
  testName: "",
  length: 0,
};

function Result() {
  const [getTestRes, setGetTestRes] = useState<GetTest>(INIT_GET_TEST_RES);
  const [progress, setProgress] = useState<Progress>({
    testId: "",
    length: 0,
    answers: [],
  });
  const [isShownSnackbar, setIsShownSnackbar] = useState<boolean>(false);
  const setTopBarTitle = useSetRecoilState<string>(topBarTitleState);
  const setIsShownSystemErrorSnackbar = useSetRecoilState<boolean>(
    isShownSystemErrorSnackbarState
  );

  const router = useRouter();

  const { instance, accounts } = useMsal();
  const accountInfo = useAccount(accounts[0] || {});

  /**
   * 正解した問題数(初期値:-1)
   */
  const correctLength: number = useMemo(() => {
    return progress.answers.length === 0
      ? -1
      : progress.answers.filter((answer: Answer) => answer.isCorrect).length;
  }, [progress]);

  // クライアントサイドでの初回レンダリング時のみ[GET] /tests/{testId}を実行
  useEffect(() => {
    if (router.isReady) {
      const { testId } = router.query;
      (async () => {
        try {
          const res: GetTest = await accessBackend<GetTest>(
            "GET",
            `/tests/${testId}`,
            instance,
            accountInfo
          );
          setGetTestRes(res);
        } catch (e) {
          console.error(e);
          setIsShownSystemErrorSnackbar(true);
        }
      })();
    }
  }, [accountInfo, instance, router, setIsShownSystemErrorSnackbar]);

  useEffect(() => {
    if (getTestRes.testName !== "") {
      setTopBarTitle(getTestRes.testName);
    }
  }, [getTestRes, setTopBarTitle]);

  useEffect(() => {
    const progressStr: string | null = localStorage.getItem("progress");
    if (!progressStr) return;
    setProgress(JSON.parse(progressStr));

    localStorage.removeItem("progress");
  }, []);

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="center" alignItems="center" pb={1}>
        <Button variant="contained" onClick={() => router.push("/")}>
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
