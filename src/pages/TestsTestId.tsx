import { useEffect, useState } from "react";
import { useAccount, useMsal } from "@azure/msal-react";
import { GetTest } from "../types/backend";
import { accessBackend } from "../services/backend";
import TestReady from "../components/TestReady";
import TestDoing from "../components/TestDoing";
import { useSetRecoilState } from "recoil";
import {
  isShownSystemErrorSnackbarState,
  topBarTitleState,
} from "../services/atoms";
import { useParams } from "react-router-dom";

const INIT_QUESTION_NUMBER: number = 0;
const INIT_GET_TEST_RES: GetTest = {
  testName: "",
  length: 0,
};

export default function TestsTestId() {
  const [questionNumber, setQuestionNumber] =
    useState<number>(INIT_QUESTION_NUMBER);
  const [getTestRes, setGetTestRes] = useState<GetTest>(INIT_GET_TEST_RES);
  const setTopBarTitle = useSetRecoilState<string>(topBarTitleState);
  const setIsShownSystemErrorSnackbar = useSetRecoilState<boolean>(
    isShownSystemErrorSnackbarState
  );

  const { testId } = useParams();

  const { instance, accounts } = useMsal();
  const accountInfo = useAccount(accounts[0] || {});

  // クライアントサイドでの初回レンダリング時のみ[GET] /tests/{testId}を実行
  useEffect(() => {
    if (testId) {
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
  }, [accountInfo, instance, setIsShownSystemErrorSnackbar, testId]);

  useEffect(() => {
    if (getTestRes.testName !== "") {
      setTopBarTitle(
        questionNumber === INIT_QUESTION_NUMBER
          ? getTestRes.testName
          : `(${questionNumber}/${getTestRes.length}) ${getTestRes.testName}`
      );
    }
  }, [getTestRes, questionNumber, setTopBarTitle]);

  return questionNumber === INIT_QUESTION_NUMBER ? (
    <TestReady getTestRes={getTestRes} setQuestionNumber={setQuestionNumber} />
  ) : (
    <TestDoing
      getTestRes={getTestRes}
      questionNumber={questionNumber}
      setQuestionNumber={setQuestionNumber}
    />
  );
}
