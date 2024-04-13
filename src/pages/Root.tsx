import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import SourceIcon from "@mui/icons-material/Source";
import ArticleIcon from "@mui/icons-material/Article";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import React, { useEffect, useState } from "react";
import { GetTests, Test } from "../types/backend";
import { accessBackend } from "../services/backend";
import { useAccount, useMsal } from "@azure/msal-react";
import { Divider, Skeleton } from "@mui/material";
import { useSetRecoilState } from "recoil";
import {
  isShownSystemErrorSnackbarState,
  topBarTitleState,
} from "../services/atoms";
import RestoreIcon from "@mui/icons-material/Restore";
import { useNavigate } from "react-router-dom";

export default function Root() {
  const [opens, setOpens] = useState<boolean[]>([]);
  const [getTestsRes, setGetTestsRes] = useState<GetTests>({});
  const [storedTestId, setStoredTestId] = useState<string>("");
  const setTopBarTitle = useSetRecoilState<string>(topBarTitleState);
  const setIsShownSystemErrorSnackbar = useSetRecoilState<boolean>(
    isShownSystemErrorSnackbarState
  );

  const { instance, accounts } = useMsal();
  const accountInfo = useAccount(accounts[0] || {});

  const navigate = useNavigate();

  const handleClickOuterListItemButton = (i: number) => {
    const updatedOpens = [...opens];
    updatedOpens[i] = !updatedOpens[i];
    setOpens(updatedOpens);
  };

  useEffect(() => {
    setTopBarTitle("Question Answer Portal");
  }, [setTopBarTitle]);

  useEffect(() => {
    const progressStr: string | null = localStorage.getItem("progress");
    setStoredTestId(
      !!progressStr && typeof JSON.parse(progressStr).testId === "string"
        ? JSON.parse(progressStr).testId
        : ""
    );
  }, []);

  // クライアントサイドでの初回レンダリング時のみ[GET] /testsを実行
  useEffect(() => {
    (async () => {
      try {
        const res: GetTests = await accessBackend<GetTests>(
          "GET",
          "/tests",
          instance,
          accountInfo
        );

        setOpens(new Array(Object.keys(res).length).fill(false));
        setGetTestsRes(res);
      } catch (e) {
        console.error(e);
        setIsShownSystemErrorSnackbar(true);
      }
    })();
  }, [accountInfo, instance, setIsShownSystemErrorSnackbar]);

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {Object.keys(getTestsRes).length > 0 ? (
        Object.keys(getTestsRes).map((course: string, i: number) => (
          <React.Fragment key={course}>
            <ListItemButton
              onClick={() => handleClickOuterListItemButton(i)}
              sx={{ height: "60px" }}
              divider
            >
              <ListItemIcon>
                <SourceIcon />
              </ListItemIcon>
              <ListItemText
                primary={course}
                primaryTypographyProps={{ variant: "h6" }}
              />
              {opens[i] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={opens[i]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {getTestsRes[course].map((test: Test) => (
                  <ListItemButton
                    key={test.id}
                    onClick={() => navigate(`/tests/${test.id}`)}
                  >
                    <ListItemIcon sx={{ ml: 2 }}>
                      <ArticleIcon />
                    </ListItemIcon>
                    <ListItemText primary={test.testName} />
                    {test.id === storedTestId && (
                      <ListItemIcon>
                        <RestoreIcon />
                      </ListItemIcon>
                    )}
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))
      ) : (
        <>
          <Skeleton variant="rectangular" width="100%" height="59.2px" />
          <Divider light sx={{ borderBottomWidth: "0.8px" }} />
          <Skeleton variant="rectangular" width="100%" height="59.2px" />
          <Divider light sx={{ borderBottomWidth: "0.8px" }} />
        </>
      )}
    </List>
  );
}
