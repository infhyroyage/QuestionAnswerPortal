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
    path: "/",
    element: (
      <>
        <TopBar />
        <Root />
      </>
    ),
  },
  {
    path: "tests/:testId",
    element: (
      <>
        <TopBar />
        <TestsTestId />
      </>
    ),
  },
  {
    path: "result",
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
