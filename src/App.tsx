import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import ApplyMUI from "./components/ApplyMUI";
import ApplyMSAL from "./components/ApplyMSAL";
import TopBar from "./components/TopBar";
import SystemErrorSnackbar from "./components/SystemErrorSnackbar";
import Root from "./pages/Root";
import TestsTestId from "./pages/TestsTestId";
import Result from "./pages/result";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "tests/:testId",
    element: <TestsTestId />,
  },
  {
    path: "result",
    element: <Result />,
  },
]);

export default function App() {
  return (
    <RecoilRoot>
      <ApplyMUI>
        <ApplyMSAL>
          <TopBar />
          <RouterProvider router={router} />
        </ApplyMSAL>
        <SystemErrorSnackbar />
      </ApplyMUI>
    </RecoilRoot>
  );
}
