import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAccount, useMsal } from "@azure/msal-react";
import { GetTest } from "@/types/backend";
import { accessBackend } from "@/services/backend";
import TestReady from "@/components/TestReady";
import TestDoing from "@/components/TestDoing";

const INIT_QUESTION_NUMBER: number = 0;
const INIT_GET_TEST_RES: GetTest = {
  testName: "",
  length: 0,
};

function TestsTestId() {
  const [questionNumber, setQuestionNumber] =
    useState<number>(INIT_QUESTION_NUMBER);
  const [getTestRes, setGetTestRes] = useState<GetTest>(INIT_GET_TEST_RES);

  const router = useRouter();

  const { instance, accounts } = useMsal();
  const accountInfo = useAccount(accounts[0] || {});

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

export default TestsTestId;
