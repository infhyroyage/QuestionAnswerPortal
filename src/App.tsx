import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import ApplyMUI from "./components/ApplyMUI";
import ApplyMSAL from "./components/ApplyMSAL";
import TopBar from "./components/TopBar";
import SystemErrorSnackbar from "./components/SystemErrorSnackbar";
import Root from "./pages/Root";
import TestsTestId from "./pages/TestsTestId";
import Result from "./pages/Result";

const router = createBrowserRouter([
  {
    path:
      import.meta.env.VITE_API_URI === "http://localhost:9229"
        ? "/"
        : "/QuestionAnswerPortal/",
    element: (
      <>
        <TopBar />
        <Root />
      </>
    ),
  },
  {
    path:
      import.meta.env.VITE_API_URI === "http://localhost:9229"
        ? "/tests/:testId"
        : "/QuestionAnswerPortal/tests/:testId",
    element: (
      <>
        <TopBar />
        <TestsTestId />
      </>
    ),
  },
  {
    path:
      import.meta.env.VITE_API_URI === "http://localhost:9229"
        ? "/result"
        : "/QuestionAnswerPortal/result",
    element: (
      <>
        <TopBar />
        <Result />
      </>
    ),
  },
]);

export default function App() {
  return (
    <RecoilRoot>
      <ApplyMUI>
        <ApplyMSAL>
          <RouterProvider router={router} />
        </ApplyMSAL>
        <SystemErrorSnackbar />
      </ApplyMUI>
    </RecoilRoot>
  );
}
